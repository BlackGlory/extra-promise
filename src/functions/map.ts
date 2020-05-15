import { map as mapIt } from 'iterable-operator'
import { parallel } from './parallel'
import { guardForConcurrency, InvalidArgumentError } from '@src/shared/guard-for-concurrency'

export function map<T, U>(iterable: Iterable<T>, fn: (element: T, i: number) => U | PromiseLike<U>, concurrency: number = Infinity): Promise<U[]> {
  guardForConcurrency('concurrency', concurrency)

  return (async () => {
    const tasks = mapIt(iterable, (x, i) => () => fn(x, i))
    return await parallel(tasks, concurrency)
  })()
}

export { InvalidArgumentError }
