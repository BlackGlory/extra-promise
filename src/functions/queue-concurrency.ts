import { TaskRunner } from '@classes/task-runner'

export function queueConcurrency<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T> {
  const runner = new TaskRunner(concurrency)

  return async function (this: unknown, ...args: Args): Promise<T> {
    return await runner.run(() => fn.apply(this, args))
  }
}
