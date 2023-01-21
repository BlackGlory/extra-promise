import { eachAsync } from './each-async.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'
import { Awaitable } from 'justypes'

export function mapAsync<T, U>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => Awaitable<U>
, concurrency: number // concurrency must be finite number
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
