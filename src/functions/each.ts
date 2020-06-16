import { parallel } from './parallel'
import { checkConcurrency, InvalidArgumentError } from '@src/shared/check-concurrency'
import { map } from 'iterable-operator'

export function each<T>(iterable: Iterable<T>, fn: (element: T, i: number) => unknown | PromiseLike<unknown>, concurrency: number = Infinity): Promise<void> {
  checkConcurrency('concurrency', concurrency)

  return (async () => {
    const tasks = map(iterable, (element, i) => () => fn(element, i))
    await parallel(tasks, concurrency)
  })()
}

export { InvalidArgumentError }
