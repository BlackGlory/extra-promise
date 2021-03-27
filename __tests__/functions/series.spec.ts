import { series } from '@functions/series'
import { delay } from '@functions/delay'
import { getCalledTimes, advanceTimersByTime, runAllMicrotasks } from '@test/utils'
import '@blackglory/jest-matchers'

describe('series(tasks: Iterable<() => unknown | PromiseLike<unknown>>): Promise<void>', () => {
  describe('tasks is empty iterable', () => {
    it('return Promise<void>', async () => {
      const result = series([])
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeUndefined()
    })
  })

  describe('tasks isnt empty iterable', () => {
    it('return Promise<void>', async () => {
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
      expect(proResult).toBeUndefined()
    })
  })
})
