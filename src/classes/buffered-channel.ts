import { Deferred } from '@classes/deferred.js'
import { DeferredGroup } from '@classes/deferred-group.js'
import { Queue } from '@blackglory/structures'
import { ChannelClosedError } from '@utils/errors.js'
import { IBlockingChannel } from '@utils/types.js'
import { FiniteStateMachine } from 'extra-fsm'

export { ChannelClosedError } from '@utils/errors.js'

export class BufferedChannel<T> implements IBlockingChannel<T> {
  private fsm = new FiniteStateMachine({
    opened: { close: 'closed' }
  , closed: {}
  }, 'opened')

  private buffer = new Queue<T>()
  private enqueueDeferredGroup = new DeferredGroup<void>()
  private dequeueDeferredGroup = new DeferredGroup<void>()

  constructor(private bufferSize: number) {}

  async send(value: T): Promise<void> {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

    // 若缓冲区队列已满, 则等待出列信号
    while (this.buffer.size === this.bufferSize) {
      // 双重检查
      if (this.fsm.matches('closed')) throw new ChannelClosedError()

      const dequeueDeferred = new Deferred<void>()
      this.dequeueDeferredGroup.add(dequeueDeferred)

      try {
        // 等待出列信号, 如果通道关闭, 则抛出错误
        await dequeueDeferred
      } finally {
        this.dequeueDeferredGroup.remove(dequeueDeferred)
      }
    }

    this.buffer.enqueue(value)
    this.enqueueDeferredGroup.resolve()
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        if (this.fsm.matches('closed')) throw new ChannelClosedError()

        return {
          next: async () => {
            if (this.fsm.matches('closed')) return { done: true, value: undefined }
  
            // 缓冲区队列为空, 则等待入列信号
            while (this.buffer.size === 0) {
              const enqueueDeferred = new Deferred<void>()
              this.enqueueDeferredGroup.add(enqueueDeferred)

              try {
                // 等待入列信号, 如果通道关闭, 则停止接收
                await enqueueDeferred
              } catch {
                return { done: true, value: undefined }
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
    if (this.fsm.matches('opened')) {
      this.fsm.send('close')

      this.buffer.empty()
      this.enqueueDeferredGroup.reject(new ChannelClosedError())
      this.dequeueDeferredGroup.reject(new ChannelClosedError())
    }
  }
}
