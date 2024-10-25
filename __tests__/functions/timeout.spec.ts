import { getErrorPromise } from 'return-style'
import { timeout, TimeoutError } from '@functions/timeout.js'
import { AbortController, AbortError } from 'extra-abort'

describe('timeout', () => {
  describe('The promise did not timed out', () => {
    test('Promise.race returns result', async () => {
      const value = 'value'
      const promise = Promise.resolve(value)
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])

      expect(await result).toBe(value)
    })
  })

  describe('The promise timed out', () => {
    test('Promise.race throws TimeoutError', async () => {
      const value = 'value'
      const promise = new Promise(resolve => setTimeout(() => resolve(value), 1000))
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])

      expect(await getErrorPromise(result)).toBeInstanceOf(TimeoutError)
    })
  })

  describe('with a signal', () => {
    test('The signal was aborted before calling', async () => {
      const controller = new AbortController()
      controller.abort()
      const setTimeout = vi.spyOn(globalThis, 'setTimeout')
      const ms = 500

      const err = await getErrorPromise(timeout(ms, controller.signal))

      expect(err).toBeInstanceOf(AbortError)
      expect(setTimeout).not.toBeCalled()
    })

    test('The signal was aborted after calling', async () => {
      const controller = new AbortController()
      const setTimeout = vi.spyOn(globalThis, 'setTimeout')
      const clearTimeout = vi.spyOn(globalThis, 'clearTimeout')
      const ms = 500

      const promise = getErrorPromise(timeout(ms, controller.signal))
      queueMicrotask(() => controller.abort())
      const err = await promise

      expect(err).toBeInstanceOf(AbortError)
      expect(setTimeout).toBeCalled()
      expect(clearTimeout).toBeCalled()
    })
  })
})
