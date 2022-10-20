import { isFailurePromise } from 'return-style'
import { Deferred } from '@classes/deferred'
import { DeferredGroup } from '@classes/deferred-group'
import { ChannelClosedError } from '@errors'
import { Mutex } from '@classes/mutex'
import { IBlockingChannel } from '@utils/types'
import { Queue } from '@blackglory/structures'

// Technically, it is the `BufferedChannel(0)`
export class Channel<T> implements IBlockingChannel<T> {
  isClosed = false

  writeLock = new Mutex()
  writeDeferredGroup = new DeferredGroup<void>()
  readDeferredGroup = new DeferredGroup<void>()

  // 此队列仅仅是一个值的容器, 可能的最长长度为1
  queue = new Queue<T>()

  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()

    const release = await this.writeLock.acquire()
    const readDeferred = new Deferred<void>()
    this.readDeferredGroup.add(readDeferred)

    try {
      // 双重检查
      if (this.isClosed) throw new ChannelClosedError()

      this.queue.enqueue(value)
      this.writeDeferredGroup.resolve()

      // 等待receive发出读取信号
      if (await isFailurePromise(readDeferred)) {
        this.queue.empty()
        throw new ChannelClosedError()
      }
    } finally {
      this.readDeferredGroup.remove(readDeferred)
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

              const writeDeferred = new Deferred<void>()
              this.writeDeferredGroup.add(writeDeferred)

              try {
                // 等待send发出写入信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(writeDeferred)) {
                  return { done: true, value: undefined }
                }
              } finally {
                this.writeDeferredGroup.remove(writeDeferred)
              }
            }

            const value = this.queue.dequeue()!
            this.readDeferredGroup.resolve()
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
      this.writeDeferredGroup.reject(new ChannelClosedError())
      this.readDeferredGroup.reject(new ChannelClosedError())
    }
  }
}

export { ChannelClosedError } from '@errors'
