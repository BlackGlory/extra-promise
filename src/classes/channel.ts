import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@classes/signal-group'
import { ChannelClosedError } from '@error'
import { Mutex } from '@classes/mutex'
import { IBlockingChannel } from '@utils/types'

// Technically, it is the `BufferedChannel(0)`
export class Channel<T> implements IBlockingChannel<T> {
  isClosed = false

  writeLock = new Mutex()
  writeSignalGroup = new SignalGroup()
  readSignalGroup = new SignalGroup()
  box: T[] = []

  // signal的关键在于, 能够阻止以下两件事发生:
  // 1. 撤销已经入列, 但还未出列的项目(需要有一个可以精准撤销项目的有序队列)
  // 2. 撤销还未入列的项目(简单, 可在获取锁时通过事件决定取消)
  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()

    const release = await this.writeLock.acquire()
    const readSignal = new Signal()
    this.readSignalGroup.add(readSignal)

    try {
      // 双重检查
      if (this.isClosed) throw new ChannelClosedError()

      this.box.push(value)
      this.writeSignalGroup.emitAll()

      // 等待receive发出读取信号
      if (await isFailurePromise(readSignal)) {
        // 删除值
        this.box.pop()
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
            while (this.box.length === 0) {
              // 如果通道关闭, 则停止接收
              if (this.isClosed) return { done: true, value: undefined }

              const writeSignal = new Signal()
              this.writeSignalGroup.add(writeSignal)

              try {
                // 等待send发出写入信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(writeSignal)) return { done: true, value: undefined }
              } finally {
                this.writeSignalGroup.remove(writeSignal)
              }
            }

            const value = this.box.pop()!
            this.readSignalGroup.emitAll()
            return { done: false, value }
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

export { ChannelClosedError } from '@error'
