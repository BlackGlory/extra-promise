import { ReusableDeferred } from '@classes/reusable-deferred'
import { getErrorPromise } from 'return-style'
import { isPromiseLike } from '@src/functions/is-promise-like'
import { assert } from '@blackglory/errors'

describe('ReusableDeferred', () => {
  test('constructor', () => {
    const defer = new ReusableDeferred()

    assert(isPromiseLike(defer), 'defer is not PromiseLike')
  })

  describe('resolve', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.resolve(value))
      const result = await defer

      expect(result).toBe(value)
    })
  })

  describe('reject', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.reject(reason))
      const err = await getErrorPromise(defer)

      expect(err).toBe(reason)
    })
  })

  test('edge: rejected', () => {
    const reason = new Error('CustomError')
    const defer = new ReusableDeferred()

    defer.reject(reason)
    defer.reject(reason)
  })

  describe('reusable', () => {
    test('resolved, resolved', async () => {
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.resolve('foo'))
      const result1 = await defer
      queueMicrotask(() => defer.resolve('bar'))
      const result2 = await defer

      expect(result1).toBe('foo')
      expect(result2).toBe('bar')
    })

    test('resolved, rejected', async () => {
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.resolve('foo'))
      const result = await defer
      queueMicrotask(() => defer.reject('bar'))
      const err = await getErrorPromise(defer)

      expect(result).toBe('foo')
      expect(err).toBe('bar')
    })

    test('rejected, rejected', async () => {
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.reject('foo'))
      const err1 = await getErrorPromise(defer)
      queueMicrotask(() => defer.reject('bar'))
      const err2 = await getErrorPromise(defer)

      expect(err1).toBe('foo')
      expect(err2).toBe('bar')
    })

    test('rejected, resolved', async () => {
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.reject('foo'))
      const err = await getErrorPromise(defer)
      queueMicrotask(() => defer.resolve('bar'))
      const result = await defer

      expect(err).toBe('foo')
      expect(result).toBe('bar')
    })
  })
})
