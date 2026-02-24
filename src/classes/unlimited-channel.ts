import { UniqueQueue } from '@blackglory/structures'
import { Deferred } from '@classes/deferred.js'
import { Queue } from '@blackglory/structures'
import { ChannelClosedError } from '@utils/errors.js'
import { INonBlockingChannel } from '@utils/types.js'
import { FiniteStateMachine } from 'extra-fsm'

export { ChannelClosedError } from '@utils/errors.js'

export class UnlimitedChannel<T> implements INonBlockingChannel<T> {
  private fsm = new FiniteStateMachine({
    opened: { close: 'closed' }
  , closed: {}
  }, 'opened')

  private enqueueDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()
  private buffer: Queue<T> = new Queue()

  send(value: T): void {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

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
    }
  }
}
