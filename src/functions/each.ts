import { parallel } from './parallel.js'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { map } from 'iterable-operator'
import { go } from '@blackglory/go'
import { Awaitable } from 'justypes'

export function each<T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<unknown>
, concurrency: number = Infinity
): Promise<void> {
  validateConcurrency('concurrency', concurrency)

  return go(async () => {
    const tasks = map(iterable, (element, i) => () => fn(element, i))
    return await parallel(tasks, concurrency)
  })
}
