import { delay } from '@functions/delay.js'
import { advanceTimersByTime } from '@test/utils.js'
import { StatefulPromise } from '@classes/stateful-promise.js'

describe('delay', () => {
  it('calls setTimeout', () => {
    const setTimeout = vi.spyOn(globalThis, 'setTimeout')
    const ms = 1000

    delay(ms)

    expect(setTimeout).toBeCalledTimes(1)
    expect(setTimeout).toBeCalledWith(expect.any(Function), ms)
  })

  it('returns Promise<void>', async () => {
    const ms = 500

    const result = delay(ms)
    const promise = StatefulPromise.from(result)

    expect(promise.isPending()).toBe(true)

    await advanceTimersByTime(500)
    expect(promise.isFulfilled()).toBe(true)
    expect(await result).toBeUndefined()
  })
})
