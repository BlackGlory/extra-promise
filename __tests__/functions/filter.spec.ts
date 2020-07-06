import { getError, getErrorAsync } from 'return-style'
import { filter, InvalidArgumentError } from '@functions/filter'
import { delay } from '@functions/delay'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable } from '@test/utils'
import '@test/matchers'

describe('filter<T, U = T>(iterable: Iterable<T>, fn: (element: T, i: number) => boolean | PromiseLike<boolean>, concurrency: number = Infinity): Promise<U[]>', () => {
  describe('concurrency < 1', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => filter([], () => true, 0))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('concurrency isnt integer', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => filter([], () => true, 1.5))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('iterable is empty', () => {
    it('return Promise<[]>', async () => {
      const result = filter([], () => true)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('return resolved Promise<U[]>', async () => {
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
          await delay(1000)
          return 3
        })
        const iter = new MockIterable([task1, task2, task3])
        const callTaskAndResultIsEven = jest.fn(async x => await x() % 2 === 0)

        const result = filter(iter, callTaskAndResultIsEven, 2)
        await runAllMicrotasks() // 0ms: task1, task2 start
        const task1CalledStep1 = getCalledTimes(task1)
        const task2CalledStep1 = getCalledTimes(task2)
        const task3CalledStep1 = getCalledTimes(task3)
        const iterNextIndexStep1 = iter.nextIndex // iterable is lazy, it should be 2: task3
        await advanceTimersByTime(500) // 500ms: task1 done, task3 start
        const task3CalledStep2 = getCalledTimes(task3)
        await advanceTimersByTime(500) // 1000ms: task2 done
        await advanceTimersByTime(500) // 1500ms: task3 done
        const proResult = await result

        expect(result).toBePromise()
        expect(task1CalledStep1).toBe(1)
        expect(task2CalledStep1).toBe(1)
        expect(task3CalledStep1).toBe(0)
        expect(iterNextIndexStep1).toBe(2)
        expect(task3CalledStep2).toBe(1)
        expect(proResult).toEqual([task2])
      })
    })

    describe('reject', () => {
      it('return rejected Promise<U[]>', async () => {
        const error = new Error('CustomError')
        const element1 = Promise.resolve(1)
        const element2 = Promise.reject(error)
        const element3 = Promise.resolve(3)
        const fn = jest.fn(async x => await x % 2 === 0)

        const result = filter([element1, element2, element3], fn, 2)
        const err = await getErrorAsync(result)

        expect(result).toBePromise()
        expect(fn).toBeCalledTimes(2)
        expect(fn).nthCalledWith(1, element1, 0)
        expect(fn).nthCalledWith(2, element2, 1)
        expect(err).toBe(error)
      })
    })
  })
})
