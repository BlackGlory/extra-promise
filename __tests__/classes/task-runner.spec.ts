import { delay } from '@functions/delay.js'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime } from '@test/utils.js'
import { TaskRunner } from '@classes/task-runner.js'
import { getErrorPromise } from 'return-style'
import { passAsync } from '@blackglory/pass'

describe('TaskRunner', () => {
  test('resolved', async () => {
    const runner = new TaskRunner(1)
    const task = jest.fn(async () => {
      return 'result'
    })

    const result = await runner.run(task)

    expect(result).toBe('result')
  })

  test('rejected', async () => {
    const runner = new TaskRunner(1)
    const task = jest.fn(async () => {
      throw new Error('custom error')
    })

    const result = await getErrorPromise(runner.run(task))

    expect(result).toBeInstanceOf(Error)
  })

  test('destroy', async () => {
    const runner = new TaskRunner(1)
    const task1 = jest.fn(async () => {
      runner.destroy()
    })
    const task2 = jest.fn(passAsync)

    runner.run(task1)
    runner.run(task2)
    await advanceTimersByTime(0)

    expect(task1).toBeCalled()
    expect(task2).not.toBeCalled()
  })

  test('consume and run tasks', async () => {
    const runner = new TaskRunner(2)
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
})
