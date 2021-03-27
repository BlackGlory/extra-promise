import { each } from './each'
import { checkConcurrency, InvalidArgumentError } from '@utils/check-concurrency'
import { go } from '@utils/go'
import { ExtraPromise } from '@classes/extra-promise'

export function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, concurrency: number = Infinity
): ExtraPromise<U[]> {
  checkConcurrency('concurrency', concurrency)

  return go(async () => {
    const results: U[] = []

    await each(iterable, async (x, i) => {
      results[i] = await fn(x, i)
    }, concurrency)

    return results
  })
}

export { InvalidArgumentError }
