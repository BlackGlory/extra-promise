import { getError, getErrorPromise } from 'return-style'
import { each, InvalidArgumentError } from '@functions/each'
import { delay } from '@functions/delay'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, MockIterable } from '@test/utils'
import '@blackglory/jest-matchers'

describe('each(iterable: Iterable<T>, fn: (element: T, i: number) => unknown | PromiseLike<unknown>, concurrency: number = Infinity): Promise<void>', () => {
  describe('concurrency < 1', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => each([], () => {}, 0))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('concurrency isnt integer', () => {
    it('throw InvalidArgumentError', () => {
      const err = getError(() => each([], () => {}, 1.5))

      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

  describe('iterable is empty', () => {
    it('return Promise<[]>', async () => {
      const result = each([], () => {})
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('return resolved Promise<void>', async () => {
        jest.useFakeTimers()
        const task1 = jest.fn(() => delay(500))
        const task2 = jest.fn(() => delay(1000))
        const task3 = jest.fn(() => delay(1000))
        const iter = new MockIterable([task1, task2, task3])
        const callTask = jest.fn(x => x())

        const result = each(iter, callTask, 2)
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
        expect(proResult).toBeUndefined()
      })
    })

    describe('reject', () => {
      it('return rejected Promise<void>', async () => {
        const error = new Error('CustomError')
        const element1 = Promise.resolve(1)
        const element2 = Promise.reject(error)
        const element3 = Promise.resolve(3)
        const fn = jest.fn(x => x)

        const result = each([element1, element2, element3], fn, 2)
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(fn).toBeCalledTimes(2)
        expect(fn).nthCalledWith(1, element1, 0)
        expect(fn).nthCalledWith(2, element2, 1)
        expect(err).toBe(error)
      })
    })
  })
})
