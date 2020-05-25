import { delay } from '@functions/delay'
import { parallel, InvalidArgumentError } from '@functions/parallel'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime } from '@test/utils'
import { getError, getErrorAsync } from 'return-style'
import '@test/matchers'

describe('parallel<T>(tasks: Iterable<() => T | PromiseLike<T>>, concurrency: number = Infinity): Promise<T[]>', () => {
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
    it('return Promise<[]>', async () => {
      const result = parallel([])
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('tasks isnt empty iterable', () => {
    describe('resolve', () => {
      it('return resolved Promise<T[]>', async () => {
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

        const result = parallel([task1, task2, task3], 2)
        await runAllMicrotasks() // 0ms: task1, task2 start
        const task1CalledStep1 = getCalledTimes(task1)
        const task2CalledStep1 = getCalledTimes(task2)
        const task3CalledStep1 = getCalledTimes(task3)
        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        const task3CalledStep2 = getCalledTimes(task3)
        await advanceTimersByTime(500) // 1000ms: task2 done
        await advanceTimersByTime(500) // 1500ms: task3 done
        const proResult = await result

        expect(result).toBePromise()
        expect(task1CalledStep1).toBe(1)
        expect(task2CalledStep1).toBe(1)
        expect(task3CalledStep1).toBe(0)
        expect(task3CalledStep2).toBe(1)
        expect(proResult).toEqual([1, 2, 3])
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
        const task1CalledStep1 = getCalledTimes(task1)
        const task2CalledStep1 = getCalledTimes(task2)
        const task3CalledStep1 = getCalledTimes(task3)
        advanceTimersByTime(500) // 500ms: task1 done, task2 throw
        const err = await getErrorAsync(result)

        expect(result).toBePromise()
        expect(task1CalledStep1).toBe(1)
        expect(task2CalledStep1).toBe(1)
        expect(task3CalledStep1).toBe(0)
        expect(task3).not.toBeCalled()
        expect(err).toBe(error)
      })
    })
  })
})