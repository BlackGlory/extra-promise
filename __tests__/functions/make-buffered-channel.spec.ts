import { makeBufferedChannel, ChannelClosedError } from '@functions/make-buffered-channel'
import { getErrorPromise } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import { delay } from '@functions/delay'
import 'jest-extended'

describe('makeBufferedChannel(bufferSize: number): [(value: T) => Promise<void>, () => AsyncIterable<T>, () => void]', () => {
  describe('close, send, receive', () => {
    it('throw ChannelClosedError', async () => {
      const bufferSize = 1
      const value = 'value'

      const [send, receive, close] = makeBufferedChannel<string>(bufferSize)
      close()
      const err = await getErrorPromise(send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('close, receive', () => {
    it('return empty AsyncIterable', async () => {
      const bufferSize = 1

      const [, receive, close] = makeBufferedChannel<string>(bufferSize)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([])
    })
  })

  describe('send, close, receive', () => {
    it('return AsyncIterable', async () => {
      const bufferSize = 1
      const value = 'value'

      const [send, receive, close] = makeBufferedChannel<string>(bufferSize)
      await send(value)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([value])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('return AsyncIterable', async () => {
      // This is why the case uses real time:
      // jest.useFakeTimers('modern') - cannot work
      // jest.useFakeTimers() - Date.now() return wrong value
      const [send, receive, close] = makeBufferedChannel<void>(2)

      const start = Date.now()
      const enqueueTiming: number[] = []
      queueMicrotask(async () => {
        // #1
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, buffer.size from 0 to 1

        // #3
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, buffer.size from 1 to 2

        // #5
        await send()
        enqueueTiming.push(getNow(start)) // 1000ms, buffer.size from 2 to 2
      })
      queueMicrotask(async () => {
        // #2
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, buffer.size from 1 to 1

        // #4
        await send()
        enqueueTiming.push(getNow(start)) // 500ms, buffer.size from 2 to 2

        // #6
        await send()
        enqueueTiming.push(getNow(start)) // 1500ms, buffer.size from 2 to 2

        queueMicrotask(close)
      })
      for await (const _ of receive()) await delay(500)

      expect(enqueueTiming[0]).toBeWithin(0, 500) // 0ms
      expect(enqueueTiming[1]).toBeWithin(0, 500) // 0ms
      expect(enqueueTiming[2]).toBeWithin(0, 500) // 0ms
      expect(enqueueTiming[3]).toBeWithin(500, 1000) // 500ms
      expect(enqueueTiming[4]).toBeWithin(1000, 1500) // 1000ms
      expect(enqueueTiming[5]).toBeWithin(1500, 2000) // 1500ms
    })
  })

  describe('multiple-producer, multiple-consumer', () => {
    it('return AsyncIterable', async () => {
      const [send, receive, close] = makeBufferedChannel<number>(1)
      const iter = receive()[Symbol.asyncIterator]()

      const promise1 = iter.next()
      const promise2 = iter.next()
      const promise3 = iter.next()

      send(1)
      send(2)
      send(3)

      const value1 = (await promise1).value
      const value2 = (await promise2).value
      const value3 = (await promise3).value

      close()

      expect(value1).toBe(1)
      expect(value2).toBe(2)
      expect(value3).toBe(3)
    })
  })
})

function getNow(start: number) {
  return Date.now() - start
}
