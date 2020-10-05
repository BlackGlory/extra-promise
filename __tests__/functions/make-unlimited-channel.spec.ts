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
})
