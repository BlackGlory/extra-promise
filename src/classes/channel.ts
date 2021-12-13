import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@classes/signal-group'
import { ChannelClosedError } from '@errors'
import { Mutex } from '@classes/mutex'
import { IBlockingChannel } from '@utils/types'
import { Queue } from '@blackglory/structures'

// Technically, it is the `BufferedChannel(0)`
export class Channel<T> implements IBlockingChannel<T> {
  isClosed = false

  writeLock = new Mutex()
  writeSignalGroup = new SignalGroup()
  readSignalGroup = new SignalGroup()

  // 此队列仅仅是一个值的容器, 可能的最长长度为1
  queue = new Queue<T>()

  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()

    const release = await this.writeLock.acquire()
    const readSignal = new Signal()
    this.readSignalGroup.add(readSignal)

    try {
      // 双重检查
      if (this.isClosed) throw new ChannelClosedError()

      this.queue.enqueue(value)
      this.writeSignalGroup.emitAll()

      // 等待receive发出读取信号
      if (await isFailurePromise(readSignal)) {
        this.queue.empty()
        throw new ChannelClosedError()
      }
    } finally {
      this.readSignalGroup.remove(readSignal)
      release()
    }
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            while (this.queue.size === 0) {
              // 如果通道关闭, 则停止接收
              if (this.isClosed) return { done: true, value: undefined }

              const writeSignal = new Signal()
              this.writeSignalGroup.add(writeSignal)

              try {
                // 等待send发出写入信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(writeSignal)) {
                  return { done: true, value: undefined }
                }
              } finally {
                this.writeSignalGroup.remove(writeSignal)
              }
            }

            const value = this.queue.dequeue()!
            this.readSignalGroup.emitAll()
            return { done: false, value }
          }
        , return: async () => {
            this.close()
            return { done: true, value: undefined }
          }
        }
      }
    }
  }

  close() {
    if (!this.isClosed) {
      this.isClosed = true
      this.writeSignalGroup.discardAll()
      this.readSignalGroup.discardAll()
    }
  }
}

export { ChannelClosedError } from '@errors'
