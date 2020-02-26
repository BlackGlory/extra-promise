import { getError } from 'return-style'
import { retry } from '../src'

test('retry(fn)', async () => {
  expect(await retry(failTimes(10))).toBe(10)
})

test('retry(fn, { interval: 500 }', async () => {
  const start = getTime()
  expect(await retry(failTimes(1), { interval: 500 })).toBe(1)
  expect(getTime() - start).toBeGreaterThanOrEqual(500)
})

test('retry(fn, { times: 1 })', async () => {
  await retry(failTimes(1), { times: 1 })
  const count = await getError(retry(failTimes(2), { times: 1 }))
  if (!count) fail()
  expect(count).toBe(2)
})

function failTimes(times: number) {
  let failCount = 0

  return () => {
    if (failCount < times) {
      failCount++
      throw failCount
    }
    return failCount
  }
}

function getTime() {
  return new Date().getTime()
}
