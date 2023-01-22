import { getErrorPromise } from 'return-style'
import { mapAsync } from '@functions/map-async.js'
import { delay } from '@functions/delay.js'
import { getCalledTimes, advanceTimersByTime, MockIterable } from '@test/utils.js'
import { StatefulPromise } from '@classes/stateful-promise.js'
import { pass } from '@blackglory/pass'
import { go } from '@blackglory/go'
import { jest } from '@jest/globals'

describe('mapAsync', () => {
  describe('iterable is empty', () => {
    it('returns Promise<[]>', async () => {
      const result = await mapAsync(go(async function* () {
        pass()
      }), pass, 100)

      expect(result).toEqual([])
    })
  })

  describe('iterable isnt empty', () => {
    describe('resolve', () => {
      it('returns resolved Promise<U[]>', async () => {
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
        const callTask = jest.fn(x => x())

        const result = mapAsync(go(async function* () {
          yield* iter
        }), callTask, 2)
        const promise = StatefulPromise.from(result)

        expect(promise.isPending()).toBe(true)

        await advanceTimersByTime(0) // 0ms: task1, task2 start
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
        expect(await result).toEqual([1, 2, 3])
      })
    })

    describe('reject', () => {
      it('returns rejected Promise<U[]>', async () => {
        const error = new Error('CustomError')
        const fn = jest.fn(() => Promise.reject(error))

        const result = mapAsync(go(async function* () {
          yield delay(0)
          yield delay(0)
          yield delay(0)
        }), fn, 2)
        const err = await getErrorPromise(result)

        expect(fn).toBeCalledTimes(1)
        expect(err).toBe(error)
      })
    })
  })
})
