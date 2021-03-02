import { getErrorPromise } from 'return-style'
import { retryForever } from '@functions/retry-forever'
import { CustomError } from '@blackglory/errors'
import '@blackglory/jest-matchers'

describe('retryForever<T>( fn: () => T | PromiseLike<T>, fatalErrors: Array<new (...args: any) => Error> = []): Promise<T>', () => {
  describe('error in fatalErrors', () => {
    it('return rejected Promise', async () => {
      const error = new Error('Error')
      const customError = new CustomError('CustomError')
      let firstRun = true
      const fn = jest.fn(() => {
        if (firstRun) {
          firstRun = false
          throw error
        } else {
          throw customError
        }
      })

      const result = retryForever(fn, [CustomError])
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(fn).toBeCalledTimes(2)
      expect(proResult).toBe(customError)
    })
  })
})
