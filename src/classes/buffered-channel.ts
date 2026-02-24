import { Deferred } from '@classes/deferred.js'
import { UniqueQueue } from '@blackglory/structures'
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

  private buffer: Queue<T> = new Queue<T>()
  private enqueueDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()
  private dequeueDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()

  constructor(private bufferSize: number) {}

  async send(value: T): Promise<void> {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

    while (this.buffer.size === this.bufferSize) {
      // 双重检查.
      if (this.fsm.matches('closed')) throw new ChannelClosedError()

      const dequeueDeferred = new Deferred<void>()
      this.dequeueDeferredQueue.enqueue(dequeueDeferred)
      try {
        await dequeueDeferred
      } finally {
        this.dequeueDeferredQueue.remove(dequeueDeferred)
      }
    }

    this.buffer.enqueue(value)
    this.enqueueDeferredQueue.dequeue()?.resolve()
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

              this.enqueueDeferredQueue.enqueue(enqueueDeferred)
              try {
                await enqueueDeferred
              } catch (e) {
                if (e instanceof ChannelClosedError) {
                  return { done: true, value: undefined }
                } else {
                  throw e
                }
              } finally {
                this.enqueueDeferredQueue.remove(enqueueDeferred)
              }
            }

            const value = this.buffer.dequeue()!
            this.dequeueDeferredQueue.dequeue()?.resolve()
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

      const error = new ChannelClosedError()
      let deferred: Deferred<void> | undefined
      while (deferred = this.enqueueDeferredQueue.dequeue()) {
        deferred.reject(error)
      }
      while (deferred = this.dequeueDeferredQueue.dequeue()) {
        deferred.reject(error)
      }
    }
  }
}
