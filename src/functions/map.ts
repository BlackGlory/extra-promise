import { each } from './each'
import { validateConcurrency } from '@utils/validate-concurrency'
import { go } from '@blackglory/go'

export function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, concurrency: number = Infinity
): Promise<U[]> {
  validateConcurrency('concurrency', concurrency)

  return go(async () => {
    const results: U[] = []

    await each(iterable, async (x, i) => {
      results[i] = await fn(x, i)
    }, concurrency)

    return results
  })
}
