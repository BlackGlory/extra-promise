import { ReusableDeferred } from '@classes/reusable-deferred'
import { getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'

describe('ReusableDeferred<T>', () => {
  describe('constructor', () => {
    it('return PromiseLike<T>', () => {
      const defer = new ReusableDeferred()

      expect(defer).toBePromiseLike()
    })
  })

  describe('resolve(value: T): void', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.resolve(value))
      const proResult = await defer

      expect(proResult).toBe(value)
    })
  })

  describe('reject(reason: any): void', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new ReusableDeferred()

      queueMicrotask(() => defer.reject(reason))
      const err = await getErrorPromise(defer)

      expect(err).toBe(reason)
    })
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
