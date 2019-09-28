import { getError } from 'return-style'
import { retryUntil } from '../src'

test('retryUntil(fn)', async () => {
  const count = await getError(retryUntil(foreverFail(), (count: number) => count === 10))
  if (!count) fail()
  expect(count).toBe(10)
})

function foreverFail() {
  let failCount = 0

  return () => {
    throw ++failCount
  }
}
