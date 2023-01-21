import { parallelAsync } from './parallel-async.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { mapAsync } from 'iterable-operator'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'
import { Awaitable } from 'justypes'

export function eachAsync<T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => Awaitable<unknown>
, concurrency: number // concurrency must be finite number
): Promise<void> {
  validateConcurrency('concurrency', concurrency)
  assert(Number.isFinite(concurrency), 'concurrency must be finite number')

  return go(async () => {
    const tasks = mapAsync(iterable, (element, i) => () => fn(element, i))
    return await parallelAsync(tasks, concurrency)
  })
}
