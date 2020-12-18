import { makeUnlimitedChannel, ChannelClosedError } from '@functions/make-unlimited-channel'
import { getError } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import 'jest-extended'

describe('makeUnlimitedChannel(): [(value: T) => void, () => AsyncIterable<T>, () => void]', () => {
  describe('close, send, receive', () => {
    it('throw ChannelClosedError', async () => {
      const value = 'value'

      const [send, receive, close] = makeUnlimitedChannel<string>()
      close()
      const err = getError(() => send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('close, receive', () => {
    it('return empty AsyncIterable', async () => {
      const [, receive, close] = makeUnlimitedChannel<string>()
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([])
    })
  })

  describe('send, close, receive', () => {
    it('return AsyncIterable', async () => {
      const value = 'value'

      const [send, receive, close] = makeUnlimitedChannel<string>()
      send(value)
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([value])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('return AsyncIterable', async () => {
      const [send, receive, close] = makeUnlimitedChannel<number>()

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

  describe('multiple-producer, multiple-consumer', () => {
    it('return AsyncIterable', async () => {
      const [send, receive, close] = makeUnlimitedChannel<number>()
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
