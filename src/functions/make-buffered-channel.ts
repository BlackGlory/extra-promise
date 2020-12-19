import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { Mutex } from '@classes/mutex'
import { SignalGroup } from '@classes/signal-group'
import { Queue } from '@src/shared/queue'
import { ChannelClosedError } from '@error'

type BlockingSend<T> = (value: T) => Promise<void>
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeBufferedChannel<T>(bufferSize: number): [BlockingSend<T>, Receive<T>, Close] {
  const channel = new BufferedChannel<T>(bufferSize)
  return [
    channel.send.bind(channel)
  , channel.receive.bind(channel)
  , channel.close.bind(channel)
  ]
}

export { ChannelClosedError }

class BufferedChannel<T> {
  isClosed = false

  enqueueSingalGroup = new SignalGroup()
  dequeueSignalGroup = new SignalGroup()
  buffer = new Queue<T>()
  readLock = new Mutex()

  constructor(private bufferSize: number) {}

  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()
    // 缓冲区队列已满, 则等待出列信号
    while (this.buffer.size === this.bufferSize) {
      const dequeueSignal = new Signal()
      this.dequeueSignalGroup.add(dequeueSignal)

      try {
        // 等待出列信号, 如果通道关闭, 则抛出错误
        if (await isFailurePromise(dequeueSignal)) throw new ChannelClosedError()
      } finally {
        this.dequeueSignalGroup.remove(dequeueSignal)
      }
      // 对通道关闭的双重检查
      if (this.isClosed) throw new ChannelClosedError()
    }
    this.buffer.enqueue(value)
    this.enqueueSingalGroup.emitAll()
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next : async () => {
            const release = await this.readLock.acquire()

            try {
              // 缓冲区队列为空, 则等待入列信号
              while (this.buffer.size === 0) {
                if (this.isClosed) return { done: true, value: undefined }

                const enqueueSignal = new Signal()
                this.enqueueSingalGroup.add(enqueueSignal)

                try {
                  // 等待入列信号, 如果通道关闭, 则停止接收
                  if (await isFailurePromise(enqueueSignal)) return { done: true, value: undefined }
                } finally {
                  this.enqueueSingalGroup.remove(enqueueSignal)
                }
              }

              const value = this.buffer.dequeue()
              this.dequeueSignalGroup.emitAll()
              return { done: false, value }
            } finally {
              release()
            }
          }
        }
      }
    }
  }

  close() {
    if (!this.isClosed) {
      this.isClosed = true
      this.enqueueSingalGroup.discardAll()
      this.dequeueSignalGroup.discardAll()
    }
  }
}
