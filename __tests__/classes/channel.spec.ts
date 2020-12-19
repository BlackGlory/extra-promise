import { Channel, ChannelClosedError } from '@classes/channel'
import { getErrorPromise } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import { delay } from '@functions/delay'
import { TIME_ERROR } from '@test/utils'
import 'jest-extended'

describe('Channel', () => {
  describe('close, send, receive', () => {
    it('throw ChannelClosedError', async () => {
      const value = 'value'

      const channel = new Channel<string>()
      channel.close()
      const err = await getErrorPromise(channel.send(value))
      const result = await toArrayAsync(channel.receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('close, receive', () => {
    it('return empty AsyncIterable', async () => {
      const channel = new Channel<string>()
      channel.close()
      const result = await toArrayAsync(channel.receive())

      expect(result).toEqual([])
    })
  })

  describe('send, close, receive', () => {
    it('throw ChannelClosedError, return empty AsyncIterable', async () => {
      const value = 'value'

      const channel = new Channel<string>()
      setImmediate(() => channel.close())
      const err = await getErrorPromise(channel.send(value))
      const result = await toArrayAsync(channel.receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('handle send and next one by one', async () => {
      // This is why the case uses real time:
      // jest.useFakeTimers('modern') - cannot work
      // jest.useFakeTimers() - Date.now() return wrong value
      const channel = new Channel<void>()

      const start = Date.now()
      const produceTiming: number[] = []
      const consumeTiming: number[] = []
      queueMicrotask(async () => {
        // #1
        produceTiming[0] = getNow(start) // 0ms
        await channel.send()
        consumeTiming[0] = getNow(start) // 500ms
      })
      queueMicrotask(async () => {
        // #2
        produceTiming[1] = getNow(start) // 0ms
        await channel.send()
        consumeTiming[1] = getNow(start) // 1000ms
        queueMicrotask(() => channel.close())
      })

      await delay(500)
      for await (const _ of channel.receive()) await delay(500)

      expect(produceTiming[0]).toBeWithin(0 - TIME_ERROR, 500 - TIME_ERROR) // 0ms
      expect(consumeTiming[0]).toBeWithin(500 - TIME_ERROR, 1000 - TIME_ERROR) // 500ms
      expect(produceTiming[1]).toBeWithin(0 - TIME_ERROR, 500 - TIME_ERROR) // 0ms
      expect(consumeTiming[1]).toBeWithin(1000 - TIME_ERROR, 1500 - TIME_ERROR) // 1000ms
    })
  })

  describe('multiple-producer, multiple-consumer', () => {
    it('return AsyncIterable', async () => {
      const channel = new Channel<number>()
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

function getNow(start: number) {
  return Date.now() - start
}
