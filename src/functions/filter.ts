import { each } from '@functions/each'
import { validateConcurrency } from '@utils/validate-concurrency'
import { go } from '@blackglory/go'

export function filter<T, U = T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => boolean | PromiseLike<boolean>
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
