import { eachAsync } from '@functions/each-async.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { go } from '@blackglory/go'
import { Awaitable } from 'justypes'

export function filterAsync<T, U = T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => Awaitable<boolean>
, concurrency: number // concurrency must be finite number
): Promise<U[]> {
  validateConcurrency('concurrency', concurrency)

  return go(async () => {
    const results: any[] = []
    await eachAsync(iterable, async (x, i) => {
      if (await fn(x, i)) {
        results[i] = x
      }
    }, concurrency)

    // Object.values will drop empty elements: Object.values([1,,,2]) = [1, 2]
    return Object.values(results)
  })
}
