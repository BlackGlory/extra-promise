import { getError } from 'return-style'
import { TaskRunner, InvalidArgumentError } from '@src/shared/task-runner'

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

  describe('tasks done', () => {
    it('emit resovled event for every task', done => {
      const cb = jest.fn()
      const task1 = jest.fn()
      const task2 = jest.fn()

      const runner = new TaskRunner()
      runner.on('resolved', setExitHook(cb, assert, done, 2))
      runner.add(task1, task2)

      function assert() {
        expect(task1).toBeCalledTimes(1)
        expect(task2).toBeCalledTimes(1)
        expect(cb).nthCalledWith(1, task1)
        expect(cb).nthCalledWith(2, task2)
      }
    })
  })

  describe('tasks throw error', () => {
    it('stop runner and emit rejected event', done => {
      const error = new Error('CustomError')
      const task1 = jest.fn().mockReturnValue(Promise.reject(error))
      const task2 = jest.fn()
      const onResolved = jest.fn()
      const onRejected = jest.fn()
      const runner = new TaskRunner()

      runner.on('resolved', onResolved)
      runner.on('rejected', setExitHook(onRejected, assert, done))
      runner.add(task1, task2)

      function assert() {
        expect(onResolved).not.toBeCalled()
        expect(onRejected).toBeCalledTimes(1)
        expect(onRejected).toBeCalledWith(task1, error)
      }
    })
  })
})

function setExitHook(fn: jest.Mock, assert: () => void, done: jest.DoneCallback, times: number = 1): jest.Mock {
  return fn.mockImplementation(() => {
    if (fn.mock.calls.length === times) {
      setTimeout((async () => {
        await assert()
        done()
      }), 0)
    }
  })
}
