import { delay } from '@functions/delay.js'
import { advanceTimersByTime } from '@test/utils.js'
import { StatefulPromise, StatefulPromiseState } from '@classes/stateful-promise.js'
import { AbortController, AbortError } from 'extra-abort'
import { getErrorPromise } from 'return-style'

describe('delay', () => {
  test('The promise was resolved after timeout', async () => {
    const timeout = 500

    const promise = delay(timeout)
    const statefulPromise = StatefulPromise.from(promise)
    const state1 = statefulPromise.state
    await advanceTimersByTime(500)
    const state2 = statefulPromise.state
    const result = await promise

    expect(state1).toBe(StatefulPromiseState.Pending)
    expect(state2).toBe(StatefulPromiseState.Fulfilled)
    expect(result).toBeUndefined()
  })

  describe('with a signal', () => {
    test('The signal was aborted before calling', async () => {
      const controller = new AbortController()
      controller.abort()
      const timeout = 500

      const err = await getErrorPromise(delay(timeout, controller.signal))

      expect(err).toBeInstanceOf(AbortError)
    })

    test('The signal was aborted after calling', async () => {
      const controller = new AbortController()
      const timeout = 500

      const promise = getErrorPromise(delay(timeout, controller.signal))
      queueMicrotask(() => controller.abort())
      const err = await promise

      expect(err).toBeInstanceOf(AbortError)
    })
  })
})
