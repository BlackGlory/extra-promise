import { getErrorPromise } from 'return-style'
import { filterAsync } from '@functions/filter-async'
import { delay } from '@functions/delay'
import { getCalledTimes, advanceTimersByTime, MockIterable }
  from '@test/utils'
import '@blackglory/jest-matchers'
import { toExtraPromise } from '@functions/to-extra-promise'
import { pass } from '@blackglory/pass'
import { go } from '@blackglory/go'

describe(`
  filterAsync<T, U = T>(
    iterable: AsyncIterable<T>
  , fn: (element: T, i: number) => boolean | PromiseLike<boolean>
  , concurrency: number = Infinity
  ): Promise<U[]>
`, () => {
  describe('iterable is empty', () => {
    it('return Promise<[]>', async () => {
      const result = filterAsync(go(async function* () {
        pass()
      }), () => true, 100)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('return resolved Promise<U[]>', async () => {
        const task1 = jest.fn(async () => {
          await delay(500)
          return 1
        })
        const task2 = jest.fn(async () => {
          await delay(1000)
          return 2
        })
        const task3 = jest.fn(async () => {
          await delay(1000)
          return 3
        })
        const iter = new MockIterable([task1, task2, task3])
        const callTaskAndResultIsEven = jest.fn(async x => await x() % 2 === 0)

        const result = filterAsync(go(async function* () {
          yield* iter
        }), callTaskAndResultIsEven, 2)
        const promise = toExtraPromise(result)

        expect(result).toBePromise()
        expect(promise.pending).toBe(true)

        await advanceTimersByTime(0) // 0ms: task1, task2 start
        expect(promise.pending).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(1)
        expect(getCalledTimes(task3)).toBe(0)
        expect(iter.nextIndex).toBe(2) // iterable is lazy, it should be 2: task3

        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        expect(promise.pending).toBe(true)
        expect(getCalledTimes(task3)).toBe(1)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(promise.pending).toBe(true)

        await advanceTimersByTime(500) // 1500ms: task3 done
        expect(promise.fulfilled).toBe(true)
        expect(await result).toEqual([task2])
      })
    })

    describe('reject', () => {
      it('return rejected Promise<U[]>', async () => {
        const error = new Error('CustomError')
        const fn = jest.fn(() => Promise.reject(error))

        const result = filterAsync(go(async function* () {
          yield delay(0)
          yield delay(0)
          yield delay(0)
        }), fn, 2)
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(fn).toBeCalledTimes(1)
        expect(err).toBe(error)
      })
    })
  })
})
