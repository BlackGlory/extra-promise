import { series } from '@functions/series'
import { delay } from '@functions/delay'
import { getCalledTimes, advanceTimersByTime } from '@test/utils'
import '@blackglory/jest-matchers'
import { StatefulPromise } from '@classes/stateful-promise'
import { pass } from '@blackglory/pass'
import { go } from '@blackglory/go'

describe('series', () => {
  describe('tasks is Iterable', () => {
    describe('tasks is empty', () => {
      it('returns Promise<void>', async () => {
        const result = series([])
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })

    describe('tasks isnt empty', () => {
      it('returns Promise<void>', async () => {
        const task1 = jest.fn().mockImplementation(async () => {
          await delay(500)
          return 1
        })
        const task2 = jest.fn().mockImplementation(async () => {
          await delay(500)
          return 2
        })

        const result = series([task1, task2])
        const promise = StatefulPromise.from(result)

        expect(result).toBePromise()
        expect(promise.isPending()).toBe(true)

        await advanceTimersByTime(0) // 0ms: task1 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(0)

        await advanceTimersByTime(500) // 500ms: task1 done, task2 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task2)).toBe(1)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(promise.isFulfilled()).toBe(true)
        expect(await result).toBeUndefined()
      })
    })
  })

  describe('tasks is AsyncIterable', () => {
    describe('tasks is empty', () => {
      it('returns Promise<void>', async () => {
        const result = series(go(async function *() {
          pass()
        }))
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })

    describe('tasks isnt empty', () => {
      it('returns Promise<void>', async () => {
        const task1 = jest.fn().mockImplementation(async () => {
          await delay(500)
          return 1
        })
        const task2 = jest.fn().mockImplementation(async () => {
          await delay(500)
          return 2
        })

        const result = series(go(async function* () {
          yield task1
          yield task2
        }))
        const promise = StatefulPromise.from(result)

        expect(result).toBePromise()
        expect(promise.isPending()).toBe(true)

        await advanceTimersByTime(0) // 0ms: task1 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task1)).toBe(1)
        expect(getCalledTimes(task2)).toBe(0)

        await advanceTimersByTime(500) // 500ms: task1 done, task2 start
        expect(promise.isPending()).toBe(true)
        expect(getCalledTimes(task2)).toBe(1)

        await advanceTimersByTime(500) // 1000ms: task2 done
        expect(promise.isFulfilled()).toBe(true)
        expect(await result).toBeUndefined()
      })
    })
  })
})
