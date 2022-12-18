import { Channel, ChannelClosedError } from '@classes/channel'
import { getErrorPromise, getErrorAsyncIterable } from 'return-style'
import { delay } from '@functions/delay'
import { setImmediate } from 'extra-timers'
import { TIME_ERROR } from '@test/utils'

describe('Channel', () => {
  describe('close, send', () => {
    it('throws ChannelClosedError', async () => {
      const value = 'value'
      const channel = new Channel<string>()

      channel.close()
      const err = await getErrorPromise(channel.send(value))

      expect(err).toBeInstanceOf(ChannelClosedError)
    })
  })

  describe('close, receive', () => {
    it('throws ChannelClosedError', async () => {
      const channel = new Channel<string>()

      channel.close()
      const err = await getErrorAsyncIterable(channel.receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
    })
  })

  describe('send, close, receive', () => {
    it('throws ChannelClosedError', async () => {
      const value = 'value'
      const channel = new Channel<string>()

      const promise = channel.send(value)
      channel.close()
      const receiveError = await getErrorAsyncIterable(channel.receive())
      const sendError = await getErrorPromise(promise)

      expect(receiveError).toBeInstanceOf(ChannelClosedError)
      expect(sendError).toBeInstanceOf(ChannelClosedError)
    })
  })

  test('the created iterator does not throw ChannelClosedError', async () => {
    const value = 'value'
    const channel = new Channel<string>()

    const promise = getErrorPromise(channel.send(value))
    const iter = channel.receive()[Symbol.asyncIterator]()
    channel.close()
    const result = await iter.next()
    const err = await promise

    expect(err).toBeInstanceOf(ChannelClosedError)
    expect(result).toStrictEqual({
      done: true
    , value: undefined
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('handles send and next one by one', async () => {
      // This is why the case uses real time:
      // jest.useFakeTimers('modern') - cannot work
      // jest.useFakeTimers() - Date.now() return wrong value
      const channel = new Channel<void>()

      const start = Date.now()
      const produceTiming: number[] = []
      const consumeTiming: number[] = []
      queueMicrotask(async () => {
        // #1
        produceTiming[0] = getElapsedTime(start) // 0ms
        await channel.send()
        consumeTiming[0] = getElapsedTime(start) // 500ms
      })
      queueMicrotask(async () => {
        // #2
        produceTiming[1] = getElapsedTime(start) // 0ms
        await channel.send()
        consumeTiming[1] = getElapsedTime(start) // 1000ms

        setImmediate(() => channel.close())
      })

      await delay(500)
      for await (const _ of channel.receive()) {
        await delay(500)
      }

      expect(produceTiming[0]).toBeGreaterThanOrEqual(0 - TIME_ERROR) // 0ms
      expect(produceTiming[0]).toBeLessThan(500 - TIME_ERROR)
      expect(consumeTiming[0]).toBeGreaterThanOrEqual(500 - TIME_ERROR) // 500ms
      expect(consumeTiming[0]).toBeLessThan(1000 - TIME_ERROR)
      expect(produceTiming[1]).toBeGreaterThanOrEqual(0 - TIME_ERROR) // 0ms
      expect(produceTiming[1]).toBeLessThan(500 - TIME_ERROR)
      expect(consumeTiming[1]).toBeGreaterThanOrEqual(1000 - TIME_ERROR) // 1000ms
      expect(consumeTiming[1]).toBeLessThan(1500 - TIME_ERROR)
    })
  })

  describe('multiple-producer, multiple-consumer', () => {
    it('returns AsyncIterable', async () => {
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

function getElapsedTime(startTime: number): number {
  return Date.now() - startTime
}
