import { parallel } from './parallel'
import { checkConcurrency, InvalidArgumentError } from '@utils/check-concurrency'
import { map } from 'iterable-operator'
import { go } from '@blackglory/go'

export function each<T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => unknown | PromiseLike<unknown>
, concurrency: number = Infinity
): Promise<void> {
  checkConcurrency('concurrency', concurrency)

  return go(async () => {
    const tasks = map(iterable, (element, i) => () => fn(element, i))
    return await parallel(tasks, concurrency)
  })
}

export { InvalidArgumentError }
