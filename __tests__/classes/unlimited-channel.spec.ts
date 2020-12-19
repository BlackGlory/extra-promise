import { UnlimitedChannel, ChannelClosedError } from '@classes/unlimited-channel'
import { getError } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import 'jest-extended'

describe('UnlimitedChannel', () => {
  describe('close, send, receive', () => {
    it('throw ChannelClosedError', async () => {
      const value = 'value'

      const channel = new UnlimitedChannel<string>()
      channel.close()
      const err = getError(() => channel.send(value))
      const result = await toArrayAsync(channel.receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('close, receive', () => {
    it('return empty AsyncIterable', async () => {
      const channel = new UnlimitedChannel<string>()
      channel.close()
      const result = await toArrayAsync(channel.receive())

      expect(result).toEqual([])
    })
  })

  describe('send, close, receive', () => {
    it('return AsyncIterable', async () => {
      const value = 'value'

      const channel = new UnlimitedChannel<string>()
      channel.send(value)
      channel.close()
      const result = await toArrayAsync(channel.receive())

      expect(result).toEqual([value])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('return AsyncIterable', async () => {
      const channel = new UnlimitedChannel<number>()

      queueMicrotask(() => {
        channel.send(1)
      })
      queueMicrotask(() => {
        channel.send(2)
        queueMicrotask(() => channel.close())
      })
      const result = await toArrayAsync(channel.receive())

      expect(result).toEqual([1, 2])
    })
  })

  describe('multiple-producer, multiple-consumer', () => {
    it('return AsyncIterable', async () => {
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
