import { getErrorPromise } from 'return-style'
import { each } from '@functions/each'
import { delay } from '@functions/delay'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable }
  from '@test/utils'
import '@blackglory/jest-matchers'
import { StatefulPromise } from '@classes/stateful-promise'
import { pass } from '@blackglory/pass'

describe(`
  each(
    iterable: Iterable<T>
  , fn: (element: T, i: number) => unknown | PromiseLike<unknown>
  , concurrency: number = Infinity
  ): Promise<void>
`, () => {
  describe('iterable is empty', () => {
    it('return Promise<[]>', async () => {
      const result = each([], pass)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('return resolved Promise<void>', async () => {
        const task1 = jest.fn(() => delay(500))
        const task2 = jest.fn(() => delay(1000))
        const task3 = jest.fn(() => delay(1000))
        const iter = new MockIterable([task1, task2, task3])
        const callTask = jest.fn(x => x())

        const result = each(iter, callTask, 2)
        const promise = StatefulPromise.from(result)

        expect(result).toBePromise()
        expect(promise.isPending()).toBe(true)

        await runAllMicrotasks() // 0ms: task1, task2 start
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(1)
        expect(getCalledTimes(task3)).toBe(0)
        expect(promise.isPending()).toBe(true)
        expect(iter.nextIndex).toBe(2) // iterable is lazy, it should be 2: task3

        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task3)).toBe(1)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(promise.isPending()).toBe(true)

        await advanceTimersByTime(500) // 1500ms: task3 done
        expect(promise.isFulfilled()).toBe(true)
        expect(await result).toBeUndefined()
      })
    })

    describe('reject', () => {
      it('return rejected Promise<void>', async () => {
        const error = new Error('CustomError')
        const element1 = Promise.reject(error)
        const element2 = Promise.resolve()
        const element3 = Promise.resolve()
        const fn = jest.fn(x => x)

        const result = each([element1, element2, element3], fn, 2)
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(fn).toBeCalledTimes(2)
        expect(err).toBe(error)
      })
    })
  })
})
