import { LazyPromise } from '@classes/lazy-promise.js'
import { getCalledTimes } from '@test/utils.js'
import { pass } from '@blackglory/pass'
import { isPromiseLike } from '@src/functions/is-promise-like.js'
import { assert } from '@blackglory/errors'

describe('LazyPromise', () => {
  test('constructor', () => {
    const lazy = new LazyPromise(pass)

    assert(isPromiseLike(lazy), 'lazy is not PromiseLike')
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
