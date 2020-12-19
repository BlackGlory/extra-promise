import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@src/shared/signal-group'
import { ChannelClosedError } from '@error'
import { Mutex } from '@classes/mutex'

type BlockingSend<T> = (value: T) => Promise<void>
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

// Technically, it is the `makeBufferedChannel(0)`
export function makeChannel<T>(): [BlockingSend<T>, Receive<T>, Close] {
  let isClosed = false

  const writeLock = new Mutex()
  const writeSignalGroup = new SignalGroup()
  const readSignalGroup = new SignalGroup()
  const readLock = new Mutex()
  const box: T[] = []

  return [send, receive, close]

  async function send(value: T): Promise<void> {
    if (isClosed) throw new ChannelClosedError()

    const release = await writeLock.acquire()
    const readSignal = new Signal()
    readSignalGroup.add(readSignal)

    try {
      // 双重检查
      if (isClosed) throw new ChannelClosedError()

      box.push(value)
      writeSignalGroup.emitAll()

      // 等待receive发出读取信号
      if (await isFailurePromise(readSignal)) {
        // 删除值
        box.pop()
        throw new ChannelClosedError()
      }
    } finally {
      readSignalGroup.remove(readSignal)
      release()
    }
  }

  function receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const release = await readLock.acquire()
            try {
              while (box.length === 0) {
                // 如果通道关闭, 则停止接收
                if (isClosed) return { done: true, value: undefined }

                const writeSignal = new Signal()
                writeSignalGroup.add(writeSignal)

                try {
                  // 等待send发出写入信号, 如果通道关闭, 则停止接收
                  if (await isFailurePromise(writeSignal)) return { done: true, value: undefined }
                } finally {
                  writeSignalGroup.remove(writeSignal)
                }
              }

              const value = box.pop()!
              readSignalGroup.emitAll()
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
      writeSignalGroup.discardAll()
      readSignalGroup.discardAll()
    }
  }
}

export { ChannelClosedError } from '@error'
