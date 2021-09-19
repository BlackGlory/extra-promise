import { queueConcurrency } from '@functions/queue-concurrency'
import { delay } from '@functions/delay'
import 'jest-extended'
import '@blackglory/jest-matchers'
import { TIME_ERROR } from '@test/utils'

test(`
  queueConcurrency<T, Args extends any[]>(
    concurrency: number
  , fn: (...args: Args) => PromiseLike<T>
  ): (...args: Args) => Promise<T>
`, async () => {
  async function fn(num: number) {
    await delay(500)
    return num
  }

  const startTime = Date.now()
  const queuedFn = queueConcurrency(2, fn)
  const result1 = queuedFn(1)
  const result2 = queuedFn(2)
  const result3 = queuedFn(3)
  const proResult1 = await result1
  const time1 = Date.now()
  const proResult2 = await result2
  const time2 = Date.now()
  const proResult3 = await result3
  const time3 = Date.now()

  expect(queuedFn).toBeFunction()
  expect(result1).toBePromise()
  expect(result2).toBePromise()
  expect(result3).toBePromise()
  expect(result1).not.toBe(result2)
  expect(result2).not.toBe(result3)
  expect(proResult1).toBe(1)
  expect(proResult2).toBe(2)
  expect(proResult3).toBe(3)
  expect(time1 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time1 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time2 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time2 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time3 - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  expect(time3 - startTime).toBeLessThan(1500 + TIME_ERROR)
})
