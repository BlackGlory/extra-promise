import { each } from '@functions/each.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { go } from '@blackglory/go'
import { Awaitable } from 'justypes'

export function filter<T, U = T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<boolean>
, concurrency: number = Infinity
): Promise<U[]> {
  validateConcurrency('concurrency', concurrency)

  return go(async () => {
    const results: any[] = []
    await each(iterable, async (x, i) => {
      if (await fn(x, i)) {
        results[i] = x
      }
    }, concurrency)

    // Object.values will drop empty elements: Object.values([1,,,2]) = [1, 2]
    return Object.values(results)
  })
}
