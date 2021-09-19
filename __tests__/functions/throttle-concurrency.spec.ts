import { throttleConcurrency } from '@functions/throttle-concurrency'
import { delay } from '@functions/delay'
import 'jest-extended'
import '@blackglory/jest-matchers'
import { TIME_ERROR } from '@test/utils'

test(`
  throttleConcurrency<T, Args extends any[]>(
    concurrency: number
  , fn: (...args: Args) => PromiseLike<T>
  ): (...args: Args) => Promise<T> | undefined
`, async () => {
  const fn = jest.fn(async (num: number) => {
    await delay(500)
    return num
  })

  const startTime = Date.now()
  const throttledFn = throttleConcurrency(2, fn)
  const result1 = throttledFn(1)
  const result2 = throttledFn(2)
  const result3 = throttledFn(3)
  const proResult1 = await result1
  const time1 = Date.now()
  const proResult2 = await result2
  const time2 = Date.now()
  const calledTimes1 = fn.mock.calls.length
  const result4 = throttledFn(4)
  const proResult3 = await result4
  const time3 = Date.now()
  const calledTimes2 = fn.mock.calls.length

  expect(throttledFn).toBeFunction()
  expect(result1).toBePromise()
  expect(result2).toBePromise()
  expect(result3).toBeUndefined()
  expect(result4).toBePromise()
  expect(proResult1).toBe(1)
  expect(proResult2).toBe(2)
  expect(proResult3).toBe(4)
  expect(time1 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time1 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time2 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time2 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time3 - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  expect(time3 - startTime).toBeLessThan(1500 + TIME_ERROR)
  expect(calledTimes1).toBe(2)
  expect(calledTimes2).toBe(3)
})
