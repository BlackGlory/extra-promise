import { isFailurePromise } from 'return-style'
import { Deferred } from '@classes/deferred'
import { DeferredGroup } from '@classes/deferred-group'
import { Queue } from '@blackglory/structures'
import { ChannelClosedError } from '@errors'
import { IBlockingChannel } from '@utils/types'

export class BufferedChannel<T> implements IBlockingChannel<T> {
  isClosed = false

  enqueueDeferredGroup = new DeferredGroup<void>()
  dequeueDeferredGroup = new DeferredGroup<void>()
  buffer = new Queue<T>()

  constructor(private bufferSize: number) {}

  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()
    // 若缓冲区队列已满, 则等待出列信号
    while (this.buffer.size === this.bufferSize) {
      const dequeueDeferred = new Deferred<void>()
      this.dequeueDeferredGroup.add(dequeueDeferred)

      try {
        // 等待出列信号, 如果通道关闭, 则抛出错误
        if (await isFailurePromise(dequeueDeferred)) throw new ChannelClosedError()
      } finally {
        this.dequeueDeferredGroup.remove(dequeueDeferred)
      }
      // 对通道关闭的双重检查
      if (this.isClosed) throw new ChannelClosedError()
    }
    this.buffer.enqueue(value)
    this.enqueueDeferredGroup.resolve()
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            // 缓冲区队列为空, 则等待入列信号
            while (this.buffer.size === 0) {
              if (this.isClosed) return { done: true, value: undefined }

              const enqueueDeferred = new Deferred<void>()
              this.enqueueDeferredGroup.add(enqueueDeferred)

              try {
                // 等待入列信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(enqueueDeferred)) {
                  return { done: true, value: undefined }
                }
              } finally {
                this.enqueueDeferredGroup.remove(enqueueDeferred)
              }
            }

            const value = this.buffer.dequeue()!
            this.dequeueDeferredGroup.resolve()
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
      this.enqueueDeferredGroup.reject(new ChannelClosedError())
      this.dequeueDeferredGroup.reject(new ChannelClosedError())
    }
  }
}

export { ChannelClosedError } from '@errors'
