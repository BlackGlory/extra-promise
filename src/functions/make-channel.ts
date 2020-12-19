import { isFailurePromise } from 'return-style'
import { Signal } from '@classes/signal'
import { SignalGroup } from '@classes/signal-group'
import { ChannelClosedError } from '@error'
import { Mutex } from '@classes/mutex'

type BlockingSend<T> = (value: T) => Promise<void>
type Receive<T> = () => AsyncIterable<T>
type Callback = () => void
type Close = Callback

// Technically, it is the `makeBufferedChannel(0)`
export function makeChannel<T>(): [BlockingSend<T>, Receive<T>, Close] {
  const channel = new Channel<T>()
  return [
    channel.send.bind(channel)
  , channel.receive.bind(channel)
  , channel.close.bind(channel)
  ]
}

export { ChannelClosedError } from '@error'

class Channel<T> {
  isClosed = false

  writeLock = new Mutex()
  writeSignalGroup = new SignalGroup()
  readSignalGroup = new SignalGroup()
  readLock = new Mutex()
  box: T[] = []

  async send(value: T): Promise<void> {
    if (this.isClosed) throw new ChannelClosedError()

    const release = await this.writeLock.acquire()
    const readSignal = new Signal()
    this.readSignalGroup.add(readSignal)

    try {
      // 双重检查
      if (this.isClosed) throw new ChannelClosedError()

      this.box.push(value)
      this.writeSignalGroup.emitAll()

      // 等待receive发出读取信号
      if (await isFailurePromise(readSignal)) {
        // 删除值
        this.box.pop()
        throw new ChannelClosedError()
      }
    } finally {
      this.readSignalGroup.remove(readSignal)
      release()
    }
  }

  receive(): AsyncIterable<T> {
    return {
      [Symbol.asyncIterator]: () => {
        return {
          next: async () => {
            const release = await this.readLock.acquire()

            try {
              while (this.box.length === 0) {
                // 如果通道关闭, 则停止接收
                if (this.isClosed) return { done: true, value: undefined }

                const writeSignal = new Signal()
                this.writeSignalGroup.add(writeSignal)

                try {
                  // 等待send发出写入信号, 如果通道关闭, 则停止接收
                  if (await isFailurePromise(writeSignal)) return { done: true, value: undefined }
                } finally {
                  this.writeSignalGroup.remove(writeSignal)
                }
              }

              const value = this.box.pop()!
              this.readSignalGroup.emitAll()
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
      this.writeSignalGroup.discardAll()
      this.readSignalGroup.discardAll()
    }
  }
}
