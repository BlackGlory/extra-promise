import { LazyPromise } from '@classes/lazy-promise'
import { getCalledTimes } from '@test/utils'
import '@blackglory/jest-matchers'

describe('LazyPromise<T>', () => {
  describe('constructor', () => {
    it('return PromiseLike<T>', () => {
      const lazy = new LazyPromise(() => {})

      expect(lazy).toBePromiseLike()
    })
  })

  describe('get then(): Promise.prototype.then', () => {
    it('call executor', async () => {
      const value = 'value'
      const executor = jest.fn().mockImplementation(resolve => resolve(value))

      const lazy = new LazyPromise(executor)
      const calledTimesBefore = getCalledTimes(executor)
      const result = await lazy
      const calledTimesAfter = getCalledTimes(executor)

      expect(calledTimesBefore).toBe(0)
      expect(result).toBe(value)
      expect(calledTimesAfter).toBe(1)
    })
  })
})
