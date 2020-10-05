import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@src/shared/signal-group'
import { Queue } from '@src/shared/queue'
import { ChannelClosedError } from '@error'

type BlockingSend<T> = (value: T) => Promise<void>
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeBufferedChannel<T>(bufferSize: number): [BlockingSend<T>, Receive<T>, Close] {
  let isClosed = false

  const enqueueSingal = new Signal()
  const dequeueSignalGroup = new SignalGroup()
  const buffer = new Queue<T>()

  return [send, receive, close]

  async function send(value: T): Promise<void> {
    if (isClosed) throw new ChannelClosedError()
    // 缓冲区队列已满, 则等待出列信号
    while (buffer.size === bufferSize) {
      const dequeueSignal = new Signal()
      dequeueSignalGroup.add(dequeueSignal)
      // 等待出列信号, 如果通道关闭, 则抛出错误
      if (await isFailurePromise(dequeueSignal)) throw new ChannelClosedError()
      // 对通道关闭的双重检查
      if (isClosed) throw new ChannelClosedError()
    }
    buffer.enqueue(value)
    enqueueSingal.emit()
  }

  function receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            // 缓冲区队列为空, 则等待入列信号
            while (buffer.size === 0) {
              if (isClosed) return { done: true, value: undefined }
              // 等待入列信号, 如果通道关闭, 则停止接收
              if (await isFailurePromise(enqueueSingal)) return { done: true, value: undefined }
              // 得到入列信号后, 刷新入列信号
              enqueueSingal.refresh()
            }

            const value = buffer.dequeue()
            dequeueSignalGroup.emitAll()
            return { done: false, value }
          }
        }
      }
    }
  }

  function close() {
    if (!isClosed) {
      isClosed = true
      enqueueSingal.discard()
      dequeueSignalGroup.discardAndRefreshAll()
    }
  }
}

export { ChannelClosedError }
