import { all } from '@functions/all'
import { getErrorPromise } from 'return-style'

describe('all', () => {
  describe('resolve', () => {
    it('returns resolved Promise', async () => {
      jest.useFakeTimers()
      const value1 = 1
      const value2 = 2
      const promise1 = Promise.resolve(value1)
      const promise2 = Promise.resolve(value2)

      const result = await all({
        result1: promise1
      , result2: promise2
      })

      expect(result).toStrictEqual({
        result1: value1
      , result2: value2
      })
    })
  })

  describe('rejected', () => {
    it('returns rejected Promise', async () => {
      const error = new Error('CustomError')
      const promise1 = Promise.reject(error)
      const promise2 = Promise.resolve()

      const err = await getErrorPromise(all({
        promise1
      , promise2
      }))

      expect(err).toBe(error)
    })
  })
})
