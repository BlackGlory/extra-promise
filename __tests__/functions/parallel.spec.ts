import { delay } from '@functions/delay'
import { parallel, InvalidArgumentError } from '@functions/parallel'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable } from '@test/utils'
import { getError, getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'

describe('parallel(tasks: Iterable<() => unknown | PromiseLike<unknown>>, concurrency: number = Infinity): Promise<void>', () => {
  describe('concurrency < 1', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => parallel([], 0))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('concurrency isnt integer', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => parallel([], 1.5))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('tasks is empty iterable', () => {
    it('return Promise<void>', async () => {
      const result = parallel([])
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })

  describe('tasks isnt empty iterable', () => {
    describe('resolve', () => {
      it('return resolved Promise<void>', async () => {
        jest.useFakeTimers()
        const task1 = jest.fn(async () => {
          await delay(500)
          return 1
        })
        const task2 = jest.fn(async () => {
          await delay(1000)
          return 2
        })
        const task3 = jest.fn(async () => {
          await delay (1000)
          return 3
        })
        const iter = new MockIterable([task1, task2, task3])

        const result = parallel(iter, 2)

        expect(result).toBePromise()
        expect(result.pending).toBe(true)

        await runAllMicrotasks() // 0ms: task1, task2 start
        expect(result.pending).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(1)
        expect(getCalledTimes(task3)).toBe(0)
        expect(iter.nextIndex).toBe(2) // iterable is lazy, it should be 2: task3

        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        expect(result.pending).toBe(true)
        expect(getCalledTimes(task3)).toBe(1)
        expect(result.pending).toBe(true)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(result.pending).toBe(true)

        await advanceTimersByTime(500) // 1500ms: task3 done
        expect(result.fulfilled).toBe(true)
        expect(await result).toBeUndefined()
      })
    })

    describe('reject', () => {
      it('return rejected Promise<void>', async () => {
        jest.useFakeTimers()
        const error = new Error('CustomError')
        const task1 = jest.fn(async () => {
          await delay(500)
          throw error
        })
        const task2 = jest.fn(async () => {
          await delay(500)
          return 1
        })
        const task3 = jest.fn()

        const result = parallel([task1, task2, task3], 2)
        result.catch(() => {}) // we will catch it later

        expect(result).toBePromise()
        expect(result.pending).toBe(true)

        await runAllMicrotasks() // 0ms: task1, task2 start
        expect(result.pending).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(1)
        expect(getCalledTimes(task3)).toBe(0)

        await advanceTimersByTime(500) // 500ms: task1 throw, task2 done
        expect(result.rejected).toBe(true)
        expect(await getErrorPromise(result)).toBe(error)
        expect(task3).not.toBeCalled()
      })
    })

    test('edge: concurrency = 1', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      const result = parallel([fn1, fn2], 1)
      expect(result).toBePromise()

      const proResult = await result
      expect(proResult).toBeUndefined()
    })
  })
})
