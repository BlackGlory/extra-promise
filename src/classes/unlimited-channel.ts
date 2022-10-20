import { isFailurePromise } from 'return-style'
import { DeferredGroup } from '@classes/deferred-group'
import { Deferred } from '@classes/deferred'
import { Queue } from '@blackglory/structures'
import { ChannelClosedError } from '@errors'
import { INonBlockingChannel } from '@utils/types'

export class UnlimitedChannel<T> implements INonBlockingChannel<T> {
  isClosed = false

  enqueueDeferredGroup = new DeferredGroup<void>()
  buffer = new Queue<T>()

  send(value: T): void {
    if (this.isClosed) throw new ChannelClosedError()
    this.buffer.enqueue(value)
    this.enqueueDeferredGroup.resolve(undefined)
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
    }
  }
}

export { ChannelClosedError } from '@errors'
