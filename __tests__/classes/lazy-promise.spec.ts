import { LazyPromise } from '@classes/lazy-promise'
import { getCalledTimes } from '@test/utils'
import '@blackglory/jest-matchers'
import { pass } from '@blackglory/pass'

describe('LazyPromise', () => {
  test('constructor', () => {
    const lazy = new LazyPromise(pass)

    expect(lazy).toBePromiseLike()
  })

  describe('then', () => {
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
