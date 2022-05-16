import { delay } from '@functions/delay'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime } from '@test/utils'
import { TaskRunner } from '@classes/task-runner'
import { getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'

describe('TaskRunner', () => {
  test('resolved', async () => {
    const runner = new TaskRunner(1)
    const task = jest.fn(async () => {
      return 'result'
    })

    runner.start()
    const result = runner.add(task)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBe('result')
  })

  test('rejected', async () => {
    const runner = new TaskRunner(1)
    const task = jest.fn(async () => {
      throw new Error('custom error')
    })

    runner.start()
    const result = runner.add(task)
    const proResult = await getErrorPromise(result)

    expect(result).toBePromise()
    expect(proResult).toBeInstanceOf(Error)
  })

  test('stop and start', async () => {
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

    runner.start()
    runner.add(task1)
    runner.add(task2)
    runner.add(task3)
    const task1CalledStep1 = getCalledTimes(task1)
    const task2CalledStep1 = getCalledTimes(task2)
    const task3CalledStep1 = getCalledTimes(task3)
    runner.stop()
    runner.start()
    await runAllMicrotasks() // 0ms: task1, task2 start
    const task1CalledStep2 = getCalledTimes(task1)
    const task2CalledStep2 = getCalledTimes(task2)
    const task3CalledStep2 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 500ms: task1 done, task3 start
    const task3CalledStep3 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 1000ms: task2 done
    await advanceTimersByTime(500) // 1500ms: task3 done

    expect(task1CalledStep1).toBe(0)
    expect(task2CalledStep1).toBe(0)
    expect(task3CalledStep1).toBe(0)
    expect(task1CalledStep2).toBe(1)
    expect(task2CalledStep2).toBe(1)
    expect(task3CalledStep2).toBe(0)
    expect(task3CalledStep3).toBe(1)
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

    runner.start()
    runner.add(task1)
    runner.add(task2)
    runner.add(task3)
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
