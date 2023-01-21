import { limitConcurrencyByQueue } from '@functions/limit-concurrency-by-queue.js'
import { delay } from '@functions/delay.js'
import { TIME_ERROR } from '@test/utils.js'

test('limitConcurrencyByQueue', async () => {
  async function fn(num: number) {
    await delay(500)
    return num
  }

  const startTime = Date.now()
  const queuedFn = limitConcurrencyByQueue(2, fn)
  const promise1 = queuedFn(1)
  const promise2 = queuedFn(2)
  const promise3 = queuedFn(3)
  const result1 = await promise1
  const time1 = Date.now()
  const result2 = await promise2
  const time2 = Date.now()
  const result3 = await promise3
  const time3 = Date.now()

  expect(promise1).not.toBe(promise2)
  expect(promise2).not.toBe(promise3)
  expect(result1).toBe(1)
  expect(result2).toBe(2)
  expect(result3).toBe(3)
  expect(time1 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time1 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time2 - startTime).toBeGreaterThanOrEqual(500 - TIME_ERROR)
  expect(time2 - startTime).toBeLessThan(1000 + TIME_ERROR)
  expect(time3 - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  expect(time3 - startTime).toBeLessThan(1500 + TIME_ERROR)
})
