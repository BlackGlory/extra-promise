import { isFailureAsync } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@classes/signal-group'
import { Queue } from '@src/shared/queue'

type BlockingSend<T> = (value: T) => Promise<void>
type Send<T> = (value: T) => void
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

export function makeChannel<T>(): [Send<T>, Receive<T>, Close] {
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
            while (buffer.size === 0) {
              if (isClosed || await isFailureAsync(enqueueSignal)) return { done: true, value: undefined }
              enqueueSignal.discard()
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

export function makeBlockingChannel<T>(bufferSize: number): [BlockingSend<T>, Receive<T>, Close] {
  let isClosed = false

  const enqueueSingal = new Signal()
  const dequeueSignalGroup = new SignalGroup()
  const buffer = new Queue<T>()

  return [send, receive, close]

  async function send(value: T): Promise<void> {
    if (isClosed) throw new ChannelClosedError()
    while (buffer.size === bufferSize) {
      const blocking = new Signal()
      dequeueSignalGroup.add(blocking)
      if (await isFailureAsync(blocking) || isClosed) throw new ChannelClosedError()
    }
    buffer.enqueue(value)
    enqueueSingal.emit()
  }

  function receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            while (buffer.size === 0) {
              if (isClosed || await isFailureAsync(enqueueSingal)) return { done: true, value: undefined }
              enqueueSingal.discard()
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


export class ChannelClosedError {
  name = this.constructor.name
}
