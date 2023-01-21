import { Deferred } from '@classes/deferred.js'
import { DeferredGroup } from '@classes/deferred-group.js'
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

  private writeLock = new Mutex()
  private writeDeferredGroup = new DeferredGroup<void>()
  private readDeferredGroup = new DeferredGroup<void>()

  // 此队列仅仅是一个值的容器, 可能的最长长度为1
  private queue = new Queue<T>()

  async send(value: T): Promise<void> {
    if (this.fsm.matches('closed')) throw new ChannelClosedError()

    await this.writeLock.acquire(async () => {
      // 双重检查
      if (this.fsm.matches('closed')) throw new ChannelClosedError()

      const readDeferred = new Deferred<void>()
      this.readDeferredGroup.add(readDeferred)

      this.queue.enqueue(value)
      this.writeDeferredGroup.resolve()

      try {
        // 等待receive发出读取信号
        await readDeferred
      } finally {
        this.readDeferredGroup.remove(readDeferred)
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

            while (this.queue.size === 0) {
              const writeDeferred = new Deferred<void>()
              this.writeDeferredGroup.add(writeDeferred)

              try {
                // 等待send发出写入信号, 如果通道关闭, 则停止接收
                await writeDeferred
              } catch {
                return { done: true, value: undefined }
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
    this.fsm.send('close')

    this.queue.empty()
    this.writeDeferredGroup.reject(new ChannelClosedError())
    this.readDeferredGroup.reject(new ChannelClosedError())
  }
}
