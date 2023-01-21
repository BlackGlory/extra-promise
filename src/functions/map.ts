import { each } from './each.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { go } from '@blackglory/go'
import { Awaitable } from 'justypes'

export function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<U>
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
