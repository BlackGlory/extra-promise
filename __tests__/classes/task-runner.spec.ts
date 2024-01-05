import { delay } from '@functions/delay.js'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime, TIME_ERROR } from '@test/utils.js'
import { TaskRunner, TaskRunnerDestroyedError } from '@classes/task-runner.js'
import { getErrorPromise } from 'return-style'
import { passAsync } from '@blackglory/pass'
import { AbortController, AbortError } from 'extra-abort'

describe('TaskRunner', () => {
  test('resolved', async () => {
    const runner = new TaskRunner(1)
    const task = vi.fn(async () => {
      return 'result'
    })

    const result = await runner.run(task)

    expect(result).toBe('result')
  })

  test('rejected', async () => {
    const runner = new TaskRunner(1)
    const task = vi.fn(async () => {
      throw new Error('custom error')
    })

    const err = await getErrorPromise(runner.run(task))

    expect(err).toBeInstanceOf(Error)
  })

  test('destroy', async () => {
    const runner = new TaskRunner(1)
    const task1 = vi.fn(async (_: AbortSignal) => {
      runner.destroy()
      return 'result'
    })
    const task2 = vi.fn(passAsync)

    const promise1 = runner.run(task1)
    const promise2 = getErrorPromise(runner.run(task2))
    await advanceTimersByTime(0)

    expect(task1).toBeCalled()
    expect(task1.mock.calls[0][0].aborted).toBe(true)
    expect(task1.mock.calls[0][0].reason).toBeInstanceOf(TaskRunnerDestroyedError)
    expect(task2).not.toBeCalled()
    expect(await promise1).toBe('result')
    expect(await promise2).toBeInstanceOf(TaskRunnerDestroyedError)
  })

  test('consume and run tasks', async () => {
    const runner = new TaskRunner(2)
    const task1 = vi.fn(async () => {
      await delay(500)
      return 1
    })
    const task2 = vi.fn(async () => {
      await delay(1000)
      return 2
    })
    const task3 = vi.fn(async () => {
      await delay (1000)
      return 3
    })

    runner.run(task1)
    runner.run(task2)
    runner.run(task3)
    await runAllMicrotasks() // 0ms: task1, task2 start
    const task1CalledStep1 = getCalledTimes(task1)
    const task2CalledStep1 = getCalledTimes(task2)
    const task3CalledStep1 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 500ms: task1 done, task3 start
    const task3CalledStep2 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 1000ms: task2 done
    await advanceTimersByTime(500) // 1500ms: task3 done

    expect(task1CalledStep1).toBe(1)
    expect(task2CalledStep1).toBe(1)
    expect(task3CalledStep1).toBe(0)
    expect(task3CalledStep2).toBe(1)
  })

  describe('signal', () => {
    test('aborted', async () => {
      const controller = new AbortController()
      controller.abort()
      const runner = new TaskRunner(1)
      const task = vi.fn(async (_: AbortSignal) => {
        return 'result'
      })

      const err = await getErrorPromise(runner.run(task, controller.signal))

      expect(task).not.toBeCalled()
      expect(err).toBeInstanceOf(AbortError)
    })

    test('will be aborted', async () => {
      const controller = new AbortController()
      const runner = new TaskRunner(1)
      const task = vi.fn(async (signal: AbortSignal) => {
        await delay(1000)
        signal.throwIfAborted()
        return 'result'
      })

      setTimeout(() => controller.abort(), 500)
      const err = await getErrorPromise(runner.run(task, controller.signal))

      expect(task).toBeCalled()
      expect(err).toBeInstanceOf(AbortError)
    })

    test('will not be aborted', async () => {
      const controller = new AbortController()
      const runner = new TaskRunner(1)
      const task = vi.fn(async (signal: AbortSignal) => {
        await delay(500)
        signal.throwIfAborted()
        return 'result'
      })

      const result = await runner.run(task, controller.signal)

      expect(task).toBeCalled()
      expect(result).toBe('result')
    })
  })

  describe('rate limiting', () => {
    test('count < limit', async () => {
      const duration = 500
      const runner = new TaskRunner(Infinity, {
        duration
      , limit: 1
      })
      const task = vi.fn(async () => {
        return Date.now()
      })

      const startTime = Date.now()
      const time = await runner.run(task)

      expect(time - startTime).toBeLessThan(duration + TIME_ERROR)
    })

    test('count = limit', async () => {
      const duration = 500
      const runner = new TaskRunner(Infinity, {
        duration
      , limit: 1
      })
      const task = vi.fn(async () => {
        return Date.now()
      })

      const time1 = await runner.run(task)
      const time2 = await runner.run(task)

      expect(time2 - time1).toBeGreaterThanOrEqual(duration - TIME_ERROR)
    })
  })
})
