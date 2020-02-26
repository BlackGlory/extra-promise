import { getError } from 'return-style'
import { Deferred } from '../../src'

test('Deferred resolve', async () => {
  const defer = new Deferred()
  queueMicrotask(() => defer.resolve('resolved'))
  expect(await defer).toBe('resolved')
})

test('Deferred reject', async () => {
  const defer = new Deferred()
  queueMicrotask(() => defer.reject('rejected'))
  const err = await getError(defer)
  if (!err) fail()
  expect(err).toBe('rejected')
})
