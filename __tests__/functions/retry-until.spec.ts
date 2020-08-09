import { getErrorPromise } from 'return-style'
import { retryUntil } from '@functions/retry-until'
import '@test/matchers'

describe('retryUntil<T, U = unknown>(fn: () => T | PromiseLike<T>, until: (error: U) => boolean | PromiseLike<boolean>): Promise<T>', () => {
  describe('fn fail once', () => {
    it('return resolved Promise', async () => {
      const value = 'value'
      const error = new Error('CustomError')
      const fn = jest.fn().mockRejectedValueOnce(error).mockResolvedValue(value)
      const until = jest.fn().mockReturnValue(false)

      const result = retryUntil(fn, until)
      const proResult = await result

      expect(result).toBePromise()
      expect(fn).toBeCalledTimes(2)
      expect(until).toBeCalledTimes(1)
      expect(until).toBeCalledWith(error)
      expect(proResult).toBe(value)
    })
  })

  describe('fn retry once', () => {
    it('return rejected Promise', async () => {
      const error = new Error('CustomError')
      const fn = jest.fn().mockRejectedValue(error)
      const until = jest.fn().mockResolvedValueOnce(false).mockResolvedValue(true)

      const result = retryUntil(fn, until)
      const proResult = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(fn).toBeCalledTimes(2)
      expect(until).toBeCalledTimes(2)
      expect(until).nthCalledWith(1, error)
      expect(until).nthCalledWith(2, error)
      expect(proResult).toBe(error)
    })
  })
})
