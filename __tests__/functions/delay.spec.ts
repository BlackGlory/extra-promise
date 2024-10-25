import { delay } from '@functions/delay.js'
import { advanceTimersByTime } from '@test/utils.js'
import { StatefulPromise } from '@classes/stateful-promise.js'
import { AbortController, AbortError } from 'extra-abort'
import { getErrorPromise } from 'return-style'

describe('delay', () => {
  test('The promise was resolved after timeout', async () => {
    const setTimeout = vi.spyOn(globalThis, 'setTimeout')
    const ms = 500

    const result = delay(ms)
    const promise = StatefulPromise.from(result)

    expect(setTimeout).toBeCalledTimes(1)
    expect(setTimeout).toBeCalledWith(expect.any(Function), ms)
    expect(promise.isPending()).toBe(true)
    await advanceTimersByTime(500)
    expect(promise.isFulfilled()).toBe(true)
    expect(await result).toBeUndefined()
  })

  describe('with a signal', () => {
    test('The signal was aborted before calling', async () => {
      const controller = new AbortController()
      controller.abort()
      const setTimeout = vi.spyOn(globalThis, 'setTimeout')
      const ms = 500

      const err = await getErrorPromise(delay(ms, controller.signal))

      expect(err).toBeInstanceOf(AbortError)
      expect(setTimeout).not.toBeCalled()
    })

    test('The signal was aborted after calling', async () => {
      const controller = new AbortController()
      const setTimeout = vi.spyOn(globalThis, 'setTimeout')
      const clearTimeout = vi.spyOn(globalThis, 'clearTimeout')
      const ms = 500

      const promise = getErrorPromise(delay(ms, controller.signal))
      queueMicrotask(() => controller.abort())
      const err = await promise

      expect(err).toBeInstanceOf(AbortError)
      expect(setTimeout).toBeCalled()
      expect(clearTimeout).toBeCalled()
    })
  })
})
