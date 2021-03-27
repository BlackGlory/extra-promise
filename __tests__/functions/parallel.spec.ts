import { delay } from '@functions/delay'
import { parallel, InvalidArgumentError } from '@functions/parallel'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable } from '@test/utils'
import { getError, getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'

describe('parallel<T>(tasks: Iterable<() => T | PromiseLike<T>>, concurrency: number = Infinity): Promise<void>', () => {
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
        await runAllMicrotasks() // 0ms: task1, task2 start
        const task1CalledTimesAtStep1 = getCalledTimes(task1)
        const task2CalledTimesAtStep1 = getCalledTimes(task2)
        const task3CalledTimesAtStep1 = getCalledTimes(task3)
        const iterNextIndexAtStep1 = iter.nextIndex // iterable is lazy, it should be 2: task3
        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        const task3CalledTimesAtStep2 = getCalledTimes(task3)
        await advanceTimersByTime(500) // 1000ms: task2 done
        await advanceTimersByTime(500) // 1500ms: task3 done
        const proResult = await result

        expect(result).toBePromise()
        expect(task1CalledTimesAtStep1).toBe(1)
        expect(task2CalledTimesAtStep1).toBe(1)
        expect(task3CalledTimesAtStep1).toBe(0)
        expect(iterNextIndexAtStep1).toBe(2)
        expect(task3CalledTimesAtStep2).toBe(1)
        expect(proResult).toBeUndefined()
      })
    })

    describe('reject', () => {
      it('return rejected Promise<T[]>', async () => {
        jest.useFakeTimers()
        const error = new Error('CustomError')
        const task1 = jest.fn(async () => {
          await delay(500)
          return 1
        })
        const task2 = jest.fn(async () => {
          await delay(500)
          throw error
        })
        const task3 = jest.fn()

        const result = parallel([task1, task2, task3], 2)
        await runAllMicrotasks() // 0ms: task1, task2 start
        const task1CalledTimesAtStep1 = getCalledTimes(task1)
        const task2CalledTimesAtStep1 = getCalledTimes(task2)
        const task3CalledTimesAtStep1 = getCalledTimes(task3)
        advanceTimersByTime(500) // 500ms: task1 done, task2 throw
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(task1CalledTimesAtStep1).toBe(1)
        expect(task2CalledTimesAtStep1).toBe(1)
        expect(task3CalledTimesAtStep1).toBe(0)
        expect(task3).not.toBeCalled()
        expect(err).toBe(error)
      })
    })

    test('edge: concurrency = 1', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      const result = parallel([fn1, fn2], 1)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })
})
