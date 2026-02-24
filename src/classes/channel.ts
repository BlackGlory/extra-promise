import { Deferred } from '@classes/deferred.js'
import { UniqueQueue } from '@blackglory/structures'
import { ChannelClosedError } from '@utils/errors.js'
import { Mutex } from '@classes/mutex.js'
import { IBlockingChannel } from '@utils/types.js'
import { Queue } from '@blackglory/structures'
import { FiniteStateMachine } from 'extra-fsm'

export { ChannelClosedError } from '@utils/errors.js'

// Technically, it is the `BufferedChannel(0)`
export class Channel<T> implements IBlockingChannel<T> {
  private fsm = new FiniteStateMachine({
    opened: { close: 'closed' }
  , closed: {}
  }, 'opened')

  private writeLock: Mutex = new Mutex()
  private writeDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()
  private readDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()

  // 此队列仅仅是一个值的容器, 最长队列长度为1.
  private box: Queue<T> = new Queue()

  async send(value: T): Promise<void> {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

    // 通过锁来防止写入超过1个值.
    await this.writeLock.acquire(async () => {
      // 双重检查.
      if (this.fsm.matches('closed')) throw new ChannelClosedError()

      const readDeferred = new Deferred<void>()
      this.readDeferredQueue.enqueue(readDeferred)

      this.box.enqueue(value)
      this.writeDeferredQueue.dequeue()?.resolve()

      try {
        await readDeferred
      } finally {
        this.readDeferredQueue.remove(readDeferred)
      }
    })
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        if (this.fsm.matches('closed')) throw new ChannelClosedError()

        return {
          next: async () => {
            if (this.fsm.matches('closed')) return { done: true, value: undefined }

            while (this.box.size === 0) {
              const writeDeferred = new Deferred<void>()

              this.writeDeferredQueue.enqueue(writeDeferred)
              try {
                await writeDeferred
              } catch (e) {
                if (e instanceof ChannelClosedError) {
                  return { done: true, value: undefined }
                } else {
                  throw e
                }
              } finally {
                this.writeDeferredQueue.remove(writeDeferred)
              }
            }

            const value = this.box.dequeue()!
            this.readDeferredQueue.dequeue()?.resolve()
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

      this.box.empty()

      const error = new ChannelClosedError()
      let deferred: Deferred<void> | undefined
      while (deferred = this.writeDeferredQueue.dequeue()) {
        deferred.reject(error)
      }
      while (deferred = this.readDeferredQueue.dequeue()) {
        deferred.reject(error)
      }
    }
  }
}
