import { TaskRunner } from '@classes/task-runner'
import { Deferred } from '@classes/deferred'


export function queueConcurrency<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T> {
  const runner = new TaskRunner(concurrency)

  return async function (this: unknown, ...args: Args): Promise<T> {
    const deferred = new Deferred<T>()
    runner.push(async () => {
      try {
        deferred.resolve(await fn.apply(this, args))
      } catch (e) {
        deferred.reject(e)
      }
    })
    return await deferred
  }
}
