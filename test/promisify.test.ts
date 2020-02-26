import { getError } from 'return-style'
import { promisify } from '../src'

test('promisify(fn) resolved', async () => {
  const asyncFn = promisify(call)
  expect(typeof asyncFn === 'function').toBeTruthy()
  expect(await asyncFn([null, 'resolved'])).toBe('resolved')
})

test('promisify(fn) rejected', async () => {
  const asyncFn = promisify(call)
  expect(typeof asyncFn === 'function').toBeTruthy()
  const err = await getError(asyncFn(['rejected']))
  if (!err) fail()
  expect(err).toBe('rejected')
})

type Callback = (err: any, result?: any) => void

function call(args: Parameters<Callback>, callback: Callback) {
  queueMicrotask(() => callback(...args))
}
