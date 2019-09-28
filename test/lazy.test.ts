import { getError } from 'return-style'
import { lazy } from '../src'

test('lazy(fn) resolved', async () => {
  let count = 0
  const increase = lazy(() => count += 1)

  await Promise.resolve()
  expect(count).toBe(0)
  expect(await increase).toBe(1)
  expect(count).toBe(1)
  expect(await increase).toBe(1)
  expect(count).toBe(1)
})

test('lazy(fn) rejected', async () => {
  let rejected = false
  const reject = lazy(() => {
    rejected = true
    throw new Error('rejected')
  })

  await Promise.resolve()
  expect(rejected).toBeFalsy()
  const err = await getError<Error>(reject)
  if (!err) fail()
  expect(rejected).toBeTruthy()
  expect(err.message).toBe('rejected')
})
