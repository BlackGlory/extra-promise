import { parallelAsync } from './parallel-async'
import { validateConcurrency } from '@utils/validate-concurrency'
import { mapAsync } from 'iterable-operator'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'

export function eachAsync<T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => unknown | PromiseLike<unknown>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<void> {
  validateConcurrency('concurrency', concurrency)
  assert(Number.isFinite(concurrency), 'concurrency must be finite number')

  return go(async () => {
    const tasks = mapAsync(iterable, (element, i) => () => fn(element, i))
    return await parallelAsync(tasks, concurrency)
  })
}
