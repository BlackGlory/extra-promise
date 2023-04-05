import { getErrorPromise } from 'return-style'
import { filter } from '@functions/filter.js'
import { delay } from '@functions/delay.js'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable }
  from '@test/utils.js'
import { StatefulPromise } from '@classes/stateful-promise.js'

describe('filter', () => {
  describe('iterable is empty', () => {
    it('returns Promise<[]>', async () => {
      const result = await filter([], () => true)

      expect(result).toEqual([])
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('returns resolved Promise<U[]>', async () => {
        const task1 = vi.fn(async () => {
          await delay(500)
          return 1
        })
        const task2 = vi.fn(async () => {
          await delay(1000)
          return 2
        })
        const task3 = vi.fn(async () => {
          await delay(1000)
          return 3
        })
        const iter = new MockIterable([task1, task2, task3])
        const callTaskAndResultIsEven = vi.fn(
          async (x: any) => await x() % 2 === 0
        )

        const result = filter(iter, callTaskAndResultIsEven, 2)
        const promise = StatefulPromise.from(result)

        expect(promise.isPending()).toBe(true)

        await runAllMicrotasks() // 0ms: task1, task2 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(1)
        expect(getCalledTimes(task3)).toBe(0)
        expect(iter.nextIndex).toBe(2) // iterable is lazy, it should be 2: task3

        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task3)).toBe(1)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(promise.isPending()).toBe(true)

        await advanceTimersByTime(500) // 1500ms: task3 done
        expect(promise.isFulfilled()).toBe(true)
        expect(await result).toEqual([task2])
      })
    })

    describe('reject', () => {
      it('returns rejected Promise<U[]>', async () => {
        const error = new Error('CustomError')
        const element1 = Promise.reject(error)
        const element2 = Promise.resolve()
        const element3 = Promise.resolve()
        const fn = vi.fn((x: any) => x)

        const result = filter([element1, element2, element3], fn, 2)
        const err = await getErrorPromise(result)

        expect(fn).toBeCalledTimes(2)
        expect(err).toBe(error)
      })
    })
  })
})
