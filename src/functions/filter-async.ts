import { eachAsync } from '@functions/each-async'
import { validateConcurrency } from '@utils/validate-concurrency'
import { go } from '@blackglory/go'

export function filterAsync<T, U = T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => boolean | PromiseLike<boolean>
, /**
   * concurrency must be finite number
   */
  concurrency: number
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
