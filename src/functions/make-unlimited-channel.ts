import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { Queue } from '@src/shared/queue'
import { ChannelClosedError } from '@error'

type Send<T> = (value: T) => void
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeUnlimitedChannel<T>(): [Send<T>, Receive<T>, Close] {
  let isClosed = false

  const enqueueSignal = new Signal()
  const buffer = new Queue<T>()

  return [send, receive, close]

  function send(value: T): void {
    if (isClosed) throw new ChannelClosedError()
    buffer.enqueue(value)
    enqueueSignal.emit()
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
              if (await isFailurePromise(enqueueSignal)) return { done: true, value: undefined }
              // 得到入列信号后, 刷新入列信号
              enqueueSignal.refresh()
            }

            const value = buffer.dequeue()
            return { done: false, value }
          }
        }
      }
    }
  }

  function close() {
    if (!isClosed) {
      isClosed = true
      enqueueSignal.discard()
    }
  }
}

export { ChannelClosedError } from '@error'
