import { getError } from 'return-style'
import { parallel } from '../src'

const minimalTick= 100

test('parallel(tasks = Infinity)', async () => {
  const start = getTime()
  const tasks = [
    delay(500, () => getTime())
  , delay(500, () => getTime())
  ]
  const result = await parallel(tasks)
  expect(result[0] - start).toBeGreaterThanOrEqual(500)
  expect(result[1] - start).toBeGreaterThanOrEqual(500)
  expect(Math.abs(result[0] - result[1])).toBeLessThanOrEqual(minimalTick)
})

test('parallel(tasks, 1)', async () => {
  const start = getTime()
  const tasks = [
    delay(500, () => getTime())
  , delay(500, () => getTime())
  ]
  const result = await parallel(tasks, 1)
  expect(result[0] - start).toBeGreaterThanOrEqual(500)
  expect(result[1] - result[0]).toBeGreaterThanOrEqual(500)
})

test('parallel(tasks, 2) rejected', async () => {
  let val: boolean
  const tasks = [
    () => val = true
  , reject()
  , () => val = false
  ]
  const err = await getError(parallel(tasks, 2))
  if (!err) fail()
  expect(val!).toBe(true)
})

function reject() {
  return () => Promise.reject(getTime())
}

function delay<T>(timeout: number, fn: () => T) {
  return () => new Promise<T>(resolve => setTimeout(() => resolve(fn()), timeout))
}

function getTime() {
  return new Date().getTime()
}
