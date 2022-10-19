import { getErrorPromise } from 'return-style'
import { Deferred } from '@classes/deferred'
import '@blackglory/jest-matchers'

describe('Deferred', () => {
  test('constructor', () => {
    const defer = new Deferred()

    expect(defer).toBePromiseLike()
  })

  describe('resolve', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new Deferred()

      const result = defer.resolve(value)
      const proResult = await defer

      expect(result).toBeUndefined()
      expect(proResult).toBe(value)
    })
  })

  describe('reject', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new Deferred()

      const result = defer.reject(reason)
      const err = await getErrorPromise(defer)

      expect(result).toBeUndefined()
      expect(err).toBe(reason)
    })
  })
})
