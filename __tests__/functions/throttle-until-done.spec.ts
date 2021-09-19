import { throttleUntilDone } from '@functions/throttle-until-done'
import { delay } from '@functions/delay'
import 'jest-extended'
import '@blackglory/jest-matchers'

test('throttleUntilDone<T>(fn: () => PromiseLike<T>): () => Promise<T>', async () => {
  const fn = jest.fn(async () => {
    await delay(500)
    return 'value'
  })

  const throttledFn = throttleUntilDone(fn)
  const result1 = throttledFn()
  const result2 = throttledFn()
  const proResult1 = await result1
  const calledTimes1 = fn.mock.calls.length
  const result3 = throttledFn()
  const proResult2 = await result3
  const calledTimes2 = fn.mock.calls.length

  expect(throttledFn).toBeFunction()
  expect(result1).toBePromise()
  expect(result1).toBe(result2)
  expect(proResult1).toBe('value')
  expect(result3).toBePromise()
  expect(result3).not.toBe(result1)
  expect(proResult2).toBe('value')
  expect(calledTimes1).toBe(1)
  expect(calledTimes2).toBe(2)
})
