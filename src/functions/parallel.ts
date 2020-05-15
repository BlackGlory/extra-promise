import { IterableOperator } from 'iterable-operator/lib/es2018/style/chaining/iterable-operator'
import { TaskRunner } from '@src/shared/task-runner'
import { guardForConcurrency, InvalidArgumentError } from '@src/shared/guard-for-concurrency'

export function parallel<T>(tasks: Iterable<() => T | PromiseLike<T>>, concurrency: number = Infinity): Promise<T[]> {
  guardForConcurrency('concurrency', concurrency)

  const runner = new TaskRunner(concurrency)
  let total = 0
  let done = 0
  const results: T[] = []

  return new Promise<T[]>((resolve, reject) => {
    runner.on('resolved', () => {
      done++
      if (done === total) {
        runner.removeAllListeners()
        resolve(results)
      }
    })

    runner.once('rejected', (_, error) => {
      runner.removeAllListeners()
      reject(error)
    })

    new IterableOperator(tasks)
      .tap(() => total++)
      .map((task, i) => async () => {
        results[i] = await task()
      })
      .each(task => runner.add(task))

    if (total === 0) {
      runner.removeAllListeners()
      resolve([])
    }
  })
}

export { InvalidArgumentError }
