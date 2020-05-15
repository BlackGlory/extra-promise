import { series } from '@functions/series'
import { delay } from '@functions/delay'
import { getCalledTimes, advanceTimersByTime, runAllMicrotasks } from '@test/utils'
import '@test/matchers'

describe('series<T>(tasks: Iterable<() => T | PromiseLike<T>>): Promise<T[]>', () => {
  describe('tasks is empty iterable', () => {
    it('return Promise<[]>', async () => {
      const result = series([])
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toEqual([])
    })
  })

  describe('tasks isnt empty iterable', () => {
    it('return Promise<T[]>', async () => {
      jest.useFakeTimers()
      const task1 = jest.fn().mockImplementation(async () => {
        await delay(500)
        return 1
      })
      const task2 = jest.fn().mockImplementation(async () => {
        await delay(500)
        return 2
      })

      const result = series([task1, task2])
      await runAllMicrotasks() // 0ms: task1 start
      const task1CalledStep1 = getCalledTimes(task1)
      const task2CalledStep1 = getCalledTimes(task2)
      await advanceTimersByTime(500) // 500ms: task1 done, task2 start
      const task2CalledStep2 = getCalledTimes(task2)
      await advanceTimersByTime(500) // 1000ms: task2 done
      const proResult = await result

      expect(result).toBePromise()
      expect(task1CalledStep1).toBe(1)
      expect(task2CalledStep1).toBe(0)
      expect(task2CalledStep2).toBe(1)
      expect(proResult).toEqual([1, 2])
    })
  })
})
