import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
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
  const writeSignal = new Signal()
  const readSignal = new Signal()
  const readLock = new Mutex()
  const box: T[] = []

  return [send, receive, close]

  async function send(value: T): Promise<void> {
    if (isClosed) throw new ChannelClosedError()

    const release = await writeLock.acquire()

    try {
      // 双重检查
      if (isClosed) throw new ChannelClosedError()

      box.push(value)
      writeSignal.emit()

      // 等待receive发出读取信号
      if (await isFailurePromise(readSignal)) {
        // 删除值
        box.pop()
        throw new ChannelClosedError()
      }
      // 得到读取信号后, 刷新读取信号
      readSignal.refresh()
    } finally {
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
                // 等待send发出写入信号, 如果通道关闭, 则停止接收
                if (await isFailurePromise(writeSignal)) return { done: true, value: undefined }
                // 得到写入信号后, 刷新写入信号
                writeSignal.refresh()
              }

              const value = box.pop()!
              readSignal.emit()
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
      writeSignal.discard()
      readSignal.discard()
    }
  }
}

export { ChannelClosedError } from '@error'
