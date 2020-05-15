import { getErrorAsync } from 'return-style'
import { Deferred } from '@classes/deferred'
import '@test/matchers'

describe('Deferred<T>', () => {
  describe('constructor', () => {
    it('return PromiseLike<T>', () => {
      const defer = new Deferred()

      expect(defer).toBePromiseLike()
    })
  })

  describe('resolve(value: T): void', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new Deferred()

      const result = defer.resolve(value)
      const proResult = await defer

      expect(result).toBeUndefined()
      expect(proResult).toBe(value)
    })
  })

  describe('reject(reason: any): void', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new Deferred()

      const result = defer.reject(reason)
      const err = await getErrorAsync(defer)

      expect(result).toBeUndefined()
      expect(err).toBe(reason)
    })
  })
})
