import { UnlimitedChannel, ChannelClosedError } from '@classes/unlimited-channel'
import { getError, getErrorAsyncIterable } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import { setImmediate } from 'extra-timers'

describe('UnlimitedChannel', () => {
  describe('close, send', () => {
    it('throws ChannelClosedError', async () => {
      const value = 'value'
      const channel = new UnlimitedChannel<string>()

      channel.close()
      const err = getError(() => channel.send(value))

      expect(err).toBeInstanceOf(ChannelClosedError)
    })
  })

  describe('close, receive', () => {
    it('throws ChannelClosedError', async () => {
      const channel = new UnlimitedChannel<string>()

      channel.close()
      const result = await getErrorAsyncIterable(channel.receive())

      expect(result).toBeInstanceOf(ChannelClosedError)
    })
  })

  describe('send, close, receive', () => {
    it('throws ChannelClosedError', async () => {
      const value = 'value'
      const channel = new UnlimitedChannel<string>()

      channel.send(value)
      channel.close()
      const err = await getErrorAsyncIterable(channel.receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
    })
  })

  test('the created iterator does not throw ChannelClosedError', async () => {
    const value = 'value'
    const channel = new UnlimitedChannel<string>()

    channel.send(value)
    const iter = channel.receive()[Symbol.asyncIterator]()
    channel.close()
    const result = await iter.next()

    expect(result).toStrictEqual({
      done: true
    , value: undefined
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('returns AsyncIterable', async () => {
      const channel = new UnlimitedChannel<number>()

      queueMicrotask(() => {
        channel.send(1)
      })
      queueMicrotask(() => {
        channel.send(2)

        setImmediate(() => channel.close())
      })
      const result = await toArrayAsync(channel.receive())

      expect(result).toEqual([1, 2])
    })
  })

  describe('multiple-producer, multiple-consumer', () => {
    it('returns AsyncIterable', async () => {
      const channel = new UnlimitedChannel<number>()
      const iter = channel.receive()[Symbol.asyncIterator]()

      const promise1 = iter.next()
      const promise2 = iter.next()
      const promise3 = iter.next()

      channel.send(1)
      channel.send(2)
      channel.send(3)

      const value1 = (await promise1).value
      const value2 = (await promise2).value
      const value3 = (await promise3).value

      channel.close()

      expect(value1).toBe(1)
      expect(value2).toBe(2)
      expect(value3).toBe(3)
    })
  })
})
