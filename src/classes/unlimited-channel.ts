import { DeferredGroup } from '@classes/deferred-group.js'
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

  private enqueueDeferredGroup = new DeferredGroup<void>()
  private buffer = new Queue<T>()

  send(value: T): void {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

    this.buffer.enqueue(value)
    this.enqueueDeferredGroup.resolve(undefined)
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
    }
  }
}
