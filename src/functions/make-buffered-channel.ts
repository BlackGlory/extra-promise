import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { Mutex } from '@classes/mutex'
import { SignalGroup } from '@src/shared/signal-group'
import { Queue } from '@src/shared/queue'
import { ChannelClosedError } from '@error'

type BlockingSend<T> = (value: T) => Promise<void>
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeBufferedChannel<T>(bufferSize: number): [BlockingSend<T>, Receive<T>, Close] {
  let isClosed = false

  const enqueueSingalGroup = new SignalGroup()
  const dequeueSignalGroup = new SignalGroup()
  const buffer = new Queue<T>()
  const readLock = new Mutex()

  return [send, receive, close]

  async function send(value: T): Promise<void> {
    if (isClosed) throw new ChannelClosedError()
    // 缓冲区队列已满, 则等待出列信号
    while (buffer.size === bufferSize) {
      const dequeueSignal = new Signal()
      dequeueSignalGroup.add(dequeueSignal)

      try {
        // 等待出列信号, 如果通道关闭, 则抛出错误
        if (await isFailurePromise(dequeueSignal)) throw new ChannelClosedError()
      } finally {
        dequeueSignalGroup.remove(dequeueSignal)
      }
      // 对通道关闭的双重检查
      if (isClosed) throw new ChannelClosedError()
    }
    buffer.enqueue(value)
    enqueueSingalGroup.emitAll()
  }

  function receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const release = await readLock.acquire()

            try {
              // 缓冲区队列为空, 则等待入列信号
              while (buffer.size === 0) {
                if (isClosed) return { done: true, value: undefined }

                const enqueueSignal = new Signal()
                enqueueSingalGroup.add(enqueueSignal)
                try {
                  // 等待入列信号, 如果通道关闭, 则停止接收
                  if (await isFailurePromise(enqueueSignal)) return { done: true, value: undefined }
                } finally {
                  enqueueSingalGroup.remove(enqueueSignal)
                }
              }

              const value = buffer.dequeue()
              dequeueSignalGroup.emitAll()
              return { done: false, value }
            } finally {
              release()
            }
          }
        }
      }
    }
  }

  function close() {
    if (!isClosed) {
      isClosed = true
      enqueueSingalGroup.discardAll()
      dequeueSignalGroup.discardAll()
    }
  }
}

export { ChannelClosedError }
