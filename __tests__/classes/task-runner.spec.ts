import { delay } from '@functions/delay'
import { getError } from 'return-style'
import { getCalledTimes, runAllMicrotasks, advanceTimersByTime } from '@test/utils'
import { TaskRunner, InvalidArgumentError } from '@classes/task-runner'

describe('TaskRunner', () => {
  describe('setConcurrency(val: number): void', () => {
    describe('val < 1', () => {
      it('throw InvalidArgumentError', () => {
        const runner = new TaskRunner()

        const err = getError(() => runner.setConcurrency(0))

        expect(err).toBeInstanceOf(InvalidArgumentError)
      })
    })

    describe('val isnt integer', () => {
      it('throw InvalidArgumentError', () => {
        const runner = new TaskRunner()

        const err = getError(() => runner.setConcurrency(1.5))

        expect(err).toBeInstanceOf(InvalidArgumentError)
      })
    })
  })

  describe('events', () => {
    it('emit started event', done => {
      const runner = new TaskRunner()
      const value = 'value'
      const task = jest.fn().mockResolvedValue(value)

      runner.on('started', (startedTask) => {
        expect(startedTask).toBe(task)
        done()
      })
      runner.push(task)
    })

    it('emit resolved event', done => {
      const runner = new TaskRunner()
      const value = 'value'
      const task = jest.fn().mockResolvedValue(value)

      runner.on('rejected', done.fail)
      runner.on('resolved', (resolvedTask, result) => {
        expect(resolvedTask).toBe(task)
        expect(result).toBe(value)
        done()
      })
      runner.push(task)
    })

    it('emit rejected event', done => {
      const runner = new TaskRunner()
      const customError = new Error('custom error')
      const task = jest.fn().mockRejectedValue(customError)

      runner.on('resolved', done.fail)
      runner.on('rejected', (rejectedTask, reason) => {
        expect(rejectedTask).toBe(task)
        expect(reason).toBe(customError)
        done()
      })
      runner.push(task)
    })
  })

  it('consumes tasks', async () => {
    jest.useFakeTimers()
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

    runner.push(task1, task2, task3)
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

  it('pause when task rejected', async () => {
    jest.useFakeTimers()
    const runner = new TaskRunner(2)
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

    runner.push(task1, task2, task3)
    await runAllMicrotasks() // 0ms: task1, task2 start
    const task1CalledStep1 = getCalledTimes(task1)
    const task2CalledStep1 = getCalledTimes(task2)
    const task3CalledStep1 = getCalledTimes(task3)
    advanceTimersByTime(500) // 500ms: task1 done, task2 throw

    expect(task1CalledStep1).toBe(1)
    expect(task2CalledStep1).toBe(1)
    expect(task3CalledStep1).toBe(0)
    expect(task3).not.toBeCalled()
  })

  it('can pause and resume', async () => {
    jest.useFakeTimers()
    const runner = new TaskRunner(2)
    runner.pause()
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

    runner.push(task1, task2, task3)
    await runAllMicrotasks()
    await advanceTimersByTime(500)
    const task1CalledStep0 = getCalledTimes(task1)
    const task2CalledStep0 = getCalledTimes(task2)
    const task3CalledStep0 = getCalledTimes(task3)
    runner.resume()
    await runAllMicrotasks() // 0ms: task1, task2 start
    const task1CalledStep1 = getCalledTimes(task1)
    const task2CalledStep1 = getCalledTimes(task2)
    const task3CalledStep1 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 500ms: task1 done, task3 start
    const task3CalledStep2 = getCalledTimes(task3)
    await advanceTimersByTime(500) // 1000ms: task2 done
    await advanceTimersByTime(500) // 1500ms: task3 done

    expect(task1CalledStep0).toBe(0)
    expect(task2CalledStep0).toBe(0)
    expect(task3CalledStep0).toBe(0)
    expect(task1CalledStep1).toBe(1)
    expect(task2CalledStep1).toBe(1)
    expect(task3CalledStep1).toBe(0)
    expect(task3CalledStep2).toBe(1)
  })
})
