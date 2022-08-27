import { MutableDeferred } from '@classes/mutable-deferred'
import { getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'

describe('MutableDeferred<T>', () => {
  describe('constructor', () => {
    it('return PromiseLike<T>', () => {
      const defer = new MutableDeferred()

      expect(defer).toBePromiseLike()
    })
  })

  describe('resolve(value: T): void', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new MutableDeferred()

      const result = defer.resolve(value)
      const proResult = await defer

      expect(result).toBeUndefined()
      expect(proResult).toBe(value)
    })
  })

  describe('reject(reason: any): void', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new MutableDeferred()

      const result = defer.reject(reason)
      const err = await getErrorPromise(defer)

      expect(result).toBeUndefined()
      expect(err).toBe(reason)
    })
  })

  test('edge: rejected', () => {
    const reason = new Error('CustomError')
    const defer = new MutableDeferred()

    defer.reject(reason)
  })

  describe('mutable', () => {
    test('resolved, resolved', async () => {
      const defer = new MutableDeferred()

      defer.resolve('foo')
      const result1 = await defer
      defer.resolve('bar')
      const result2 = await defer

      expect(result1).toBe('foo')
      expect(result2).toBe('bar')
    })

    test('resolved, rejected', async () => {
      const defer = new MutableDeferred()

      defer.resolve('foo')
      const result = await defer
      defer.reject('bar')
      const err = await getErrorPromise(defer)

      expect(result).toBe('foo')
      expect(err).toBe('bar')
    })

    test('rejected, rejected', async () => {
      const defer = new MutableDeferred()

      defer.reject('foo')
      const err1 = await getErrorPromise(defer)
      defer.reject('bar')
      const err2 = await getErrorPromise(defer)

      expect(err1).toBe('foo')
      expect(err2).toBe('bar')
    })

    test('rejected, resolved', async () => {
      const defer = new MutableDeferred()

      defer.reject('foo')
      const err = await getErrorPromise(defer)
      defer.resolve('bar')
      const result = await defer

      expect(err).toBe('foo')
      expect(result).toBe('bar')
    })
  })
})
