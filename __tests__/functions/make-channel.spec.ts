import { makeChannel, ChannelClosedError } from '@functions/make-channel'
import { getErrorPromise } from 'return-style'
import { toArrayAsync } from 'iterable-operator'
import { delay } from '@functions/delay'
import 'jest-extended'

describe('makeChannel(): [(value: T) => Promise<void>, () => AsyncIterable<T>, () => void]', () => {
  describe('close, send, receive', () => {
    it('throw ChannelClosedError', async () => {
      const value = 'value'

      const [send, receive, close] = makeChannel<string>()
      close()
      const err = await getErrorPromise(send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('close, receive', () => {
    it('return empty AsyncIterable', async () => {
      const [, receive, close] = makeChannel<string>()
      close()
      const result = await toArrayAsync(receive())

      expect(result).toEqual([])
    })
  })

  describe('send, close, receive', () => {
    it('throw ChannelClosedError, return empty AsyncIterable', async () => {
      const value = 'value'

      const [send, receive, close] = makeChannel<string>()
      setImmediate(() => close())
      const err = await getErrorPromise(send(value))
      const result = await toArrayAsync(receive())

      expect(err).toBeInstanceOf(ChannelClosedError)
      expect(result).toEqual([])
    })
  })

  describe('multiple-producer, single-consumer', () => {
    it('handle send and next one by one', async () => {
      // This is why the case uses real time:
      // jest.useFakeTimers('modern') - cannot work
      // jest.useFakeTimers() - Date.now() return wrong value
      const [send, receive, close] = makeChannel<void>()

      const start = Date.now()
      const produceTiming: number[] = []
      const consumeTiming: number[] = []
      queueMicrotask(async () => {
        // #1
        produceTiming[0] = getNow(start) // 0ms
        await send()
        consumeTiming[0] = getNow(start) // 500ms
      })
      queueMicrotask(async () => {
        // #2
        produceTiming[1] = getNow(start) // 0ms
        await send()
        consumeTiming[1] = getNow(start) // 1000ms
        queueMicrotask(close)
      })

      await delay(500)
      for await (const _ of receive()) await delay(500)

      expect(produceTiming[0]).toBeWithin(0, 500) // 0ms
      expect(consumeTiming[0]).toBeWithin(500, 1000) // 500ms
      expect(produceTiming[1]).toBeWithin(0, 500) // 0ms
      expect(consumeTiming[1]).toBeWithin(consumeTiming[0] + 500, consumeTiming[0] + 1000) // 1000ms
    })
  })
})

function getNow(start: number) {
  return Date.now() - start
}
