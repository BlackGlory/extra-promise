import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { TaskRunner } from '@src/shared/task-runner'
import { guardForConcurrency, InvalidArgumentError } from '@src/shared/guard-for-concurrency'

export function each<T>(iterable: Iterable<T>, fn: (element: T, i: number) => unknown | PromiseLike<unknown>, concurrency: number = Infinity): Promise<void> {
  guardForConcurrency('concurrency', concurrency)

  const runner = new TaskRunner(concurrency)
  let total = 0
  let done = 0

  return new Promise<void>((resolve, reject) => {
    runner.on('resolved', () => {
      done++
      if (done === total) {
        runner.removeAllListeners()
        resolve()
      }
    })

    runner.once('rejected', (_, error) => {
      runner.removeAllListeners()
      reject(error)
    })

    new IterableOperator(iterable)
      .tap(() => total++)
      .map((task, i) => async () => {
        await fn(task, i)
      })
      .each(task => runner.add(task))

    if (total === 0) {
      runner.removeAllListeners()
      resolve()
    }
  })
}

export { InvalidArgumentError }
