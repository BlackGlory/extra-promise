import { getErrorPromise } from 'return-style'
import { Deferred } from '@classes/deferred.js'
import { isPromiseLike } from '@src/functions/is-promise-like.js'
import { assert } from '@blackglory/errors'

describe('Deferred', () => {
  test('constructor', () => {
    const defer = new Deferred()

    assert(isPromiseLike(defer), 'defer is not PromiseLike')
  })

  describe('resolve', () => {
    it('resolved', async () => {
      const value = 'resolved'
      const defer = new Deferred()

      defer.resolve(value)
      const result = await defer

      expect(result).toBe(value)
    })
  })

  describe('reject', () => {
    it('rejected', async () => {
      const reason = new Error('CustomError')
      const defer = new Deferred()

      defer.reject(reason)
      const err = await getErrorPromise(defer)

      expect(err).toBe(reason)
    })
  })
})
