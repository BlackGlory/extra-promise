import { validateConcurrency } from '@utils/validate-concurrency'

export function throttleConcurrency<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T> | undefined {
  validateConcurrency('concurrency', concurrency)
  let pending = 0

  return function (this: unknown, ...args: Args): Promise<T> | undefined {
    if (pending < concurrency) {
      pending++
      return Promise.resolve(fn.apply(this, args))
        .finally(() => pending--)
    }
  }
}
