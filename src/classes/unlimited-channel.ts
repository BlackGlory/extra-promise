import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@classes/signal-group'
import { Queue } from '@blackglory/structures'
import { ChannelClosedError } from '@error'
import { IChannel } from '@shared/types'

export class UnlimitedChannel<T> implements IChannel<T> {
  isClosed = false

  enqueueSignalGroup = new SignalGroup()
  buffer = new Queue<T>()

  send(value: T): void {
    if (this.isClosed) throw new ChannelClosedError()
    this.buffer.enqueue(value)
    this.enqueueSignalGroup.emitAll()
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            // 缓冲区队列为空, 则等待入列信号
            while (this.buffer.size === 0) {
              if (this.isClosed) return { done: true, value: undefined }

              const enqueueSignal = new Signal()
              this.enqueueSignalGroup.add(enqueueSignal)

              try {
                // 等待入列信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(enqueueSignal)) return { done: true, value: undefined }
              } finally {
                this.enqueueSignalGroup.remove(enqueueSignal)
              }
            }

            const value = this.buffer.dequeue()
            return { done: false, value }
          }
        }
      }
    }
  }

  close() {
    if (!this.isClosed) {
      this.isClosed = true
      this.enqueueSignalGroup.discardAll()
    }
  }
}

export { ChannelClosedError } from '@error'
