import { waterfall } from '@functions/waterfall'
import { getErrorPromise } from 'return-style'
import '@test/matchers'

describe('waterfall<T>(tasks: Iterable<(result: unknown) => unknown | PromiseLike<unknown>>): Promise<T | undefined>', () => {
  describe('tasks is empty iterable', () => {
    it('return Promise<undefined>', async () => {
      const result = waterfall([])
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })

  describe('resolve', () => {
    it('return Promise<T>', async () => {
      const value1 = 'value1'
      const value2 = 'value2'
      const task1 = jest.fn().mockReturnValue(Promise.resolve(value1))
      const task2 = jest.fn().mockReturnValue(Promise.resolve(value2))

      const result = waterfall([task1, task2])
      const proResult = await result

      expect(result).toBePromise()
      expect(task1).toBeCalledTimes(1)
      expect(task1).toBeCalledWith(undefined)
      expect(task2).toBeCalledTimes(1)
      expect(task2).toBeCalledWith(value1)
      expect(proResult).toBe(value2)
    })
  })

  describe('reject', () => {
    it('return rejected Promise', async () => {
      const error = new Error('CustomError')
      const value = 'value'
      const task1 = jest.fn().mockReturnValue(Promise.reject(error))
      const task2 = jest.fn().mockReturnValue(Promise.resolve(value))

      const result = waterfall([task1, task2])
      const err = await getErrorPromise(result)

      expect(result).toBePromise()
      expect(task1).toBeCalledTimes(1)
      expect(task2).not.toBeCalled()
      expect(err).toBe(error)
    })
  })
})
