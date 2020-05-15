import { makeChannel, makeBlockingChannel, ChannelClosedError } from '@functions/channel'
import { getError, getErrorAsync } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import { delay } from '@functions/delay'
import 'jest-extended'

describe('makeChannel(): [(value: T) => void, () => AsyncIterable<T>, () => void]', () => {
  describe('close send', () => {
    it('throw ChannelClosedError', async () => {
      const value = 'value'

      const [send, receive, close] = makeChannel<string>()
      close()
      const err = getError(() => send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('send close', () => {
    it('return AsyncIterable', async () => {
      const value = 'value'

      const [send, receive, close] = makeChannel<string>()
      send(value)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([value])
    })
  })

  describe('close', () => {
    it('return empty AsyncIterable', async () => {
      const [, receive, close] = makeChannel<string>()
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('return AsyncIterable', async () => {
      const [send, receive, close] = makeChannel<number>()

      queueMicrotask(() => {
        send(1)
      })
      queueMicrotask(() => {
        send(2)
        queueMicrotask(close)
      })
      const result = await toArrayAsync(receive())

      expect(result).toEqual([1, 2])
    })
  })
})

describe('makeBlockingChannel(bufferSize: number): [(value: T) => Promise<void>, () => AsyncIterable<T>, () => void]', () => {
  describe('close send', () => {
    it('throw ChannelClosedError', async () => {
      const bufferSize = 1
      const value = 'value'

      const [send, receive, close] = makeBlockingChannel<string>(bufferSize)
      close()
      const err = await getErrorAsync(send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('send close', () => {
    it('return AsyncIterable', async () => {
      const bufferSize = 1
      const value = 'value'

      const [send, receive, close] = makeBlockingChannel<string>(bufferSize)
      await send(value)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([value])
    })
  })

  describe('close', () => {
    it('return empty AsyncIterable', async () => {
      const bufferSize = 1

      const [, receive, close] = makeBlockingChannel<string>(bufferSize)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('return AsyncIterable', async () => {
      // This is why the case uses real time:
      // jest.useFakeTimers('modern') - cannot work
      // jest.useFakeTimers() - Date.now() return wrong value
      const [send, receive, close] = makeBlockingChannel<void>(2)

      const start = Date.now()
      const enqueueTiming: number[] = []
      queueMicrotask(async () => {
        // #1
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, size = 0 to 1

        // #3
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, size = 1 to 2

        // #5
        await send()
        enqueueTiming.push(getNow(start)) // 1000ms, size = 2 to 2
      })
      queueMicrotask(async () => {
        // #2
        await send()
        enqueueTiming.push(getNow(start)) // 0ms, size = 1 to 1

        // #4
        await send()
        enqueueTiming.push(getNow(start)) // 500ms, size = 2 to 2

        // #6
        await send()
        enqueueTiming.push(getNow(start)) // 1500ms, size = 2 to 2

        queueMicrotask(close)
      })
      for await (const _ of receive()) await delay(500)

      expect(enqueueTiming[0]).toBeWithin(0, 500) // 0ms
      expect(enqueueTiming[1]).toBeWithin(enqueueTiming[0], enqueueTiming[0] + 500) // 0ms
      expect(enqueueTiming[2]).toBeWithin(enqueueTiming[1], enqueueTiming[1] + 500) // 0ms
      expect(enqueueTiming[3]).toBeWithin(enqueueTiming[2] + 500, enqueueTiming[2] + 1000) // 500ms
      expect(enqueueTiming[4]).toBeWithin(enqueueTiming[3] + 500, enqueueTiming[3] + 1000) // 1000ms
      expect(enqueueTiming[5]).toBeWithin(enqueueTiming[4] + 500, enqueueTiming[4] + 1000) // 1500ms
    })
  })
})

function getNow(start: number) {
  return Date.now() - start
}
