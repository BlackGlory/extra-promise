import { eachAsync } from './each-async'
import { validateConcurrency } from '@utils/validate-concurrency'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'

export function mapAsync<T, U>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<U[]> {
  validateConcurrency('concurrency', concurrency)
  assert(Number.isFinite(concurrency), 'concurrency must be finite number')

  return go(async () => {
    const results: U[] = []

    await eachAsync(iterable, async (x, i) => {
      results[i] = await fn(x, i)
    }, concurrency)

    return results
  })
}
