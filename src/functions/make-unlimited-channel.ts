import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@src/shared/signal-group'
import { Mutex } from '@classes/mutex'
import { Queue } from '@src/shared/queue'
import { ChannelClosedError } from '@error'

type Send<T> = (value: T) => void
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeUnlimitedChannel<T>(): [Send<T>, Receive<T>, Close] {
  let isClosed = false

  const enqueueSignalGroup = new SignalGroup()
  const readLock = new Mutex()
  const buffer = new Queue<T>()

  return [send, receive, close]

  function send(value: T): void {
    if (isClosed) throw new ChannelClosedError()
    buffer.enqueue(value)
    enqueueSignalGroup.emitAll()
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
                enqueueSignalGroup.add(enqueueSignal)

                try {
                  // 等待入列信号, 如果通道关闭, 则停止接收
                  if (await isFailurePromise(enqueueSignal)) return { done: true, value: undefined }
                } finally {
                  enqueueSignalGroup.remove(enqueueSignal)
                }
              }

              const value = buffer.dequeue()
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
      enqueueSignalGroup.discardAll()
    }
  }
}

export { ChannelClosedError } from '@error'
