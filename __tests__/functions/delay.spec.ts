import { delay } from '@functions/delay'
import { advanceTimersByTime } from '@test/utils'
import '@blackglory/jest-matchers'

describe('delay(timeout: number): Promise<void>', () => {
  it('call setTimeout', () => {
    jest.useFakeTimers()
    const ms = 1000

    delay(ms)

    expect(setTimeout).toBeCalledTimes(1)
    expect(setTimeout).toBeCalledWith(expect.any(Function), ms)
  })

  it('return Promise<void>', async () => {
    jest.useFakeTimers()
    const ms = 500

    const result = delay(ms)

    expect(result).toBePromise()
    expect(result.pending).toBe(true)

    await advanceTimersByTime(500)
    expect(result.fulfilled).toBe(true)
    expect(await result).toBeUndefined()
  })
})
