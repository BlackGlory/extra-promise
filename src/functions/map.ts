import { each } from './each'
import { checkConcurrency, InvalidArgumentError } from '@shared/check-concurrency'

export function map<T, U>(iterable: Iterable<T>, fn: (element: T, i: number) => U | PromiseLike<U>, concurrency: number = Infinity): Promise<U[]> {
  checkConcurrency('concurrency', concurrency)

  return (async () => {
    const results: U[] = []
    await each(iterable, async (x, i) => {
      results[i] = await fn(x, i)
    }, concurrency)
    return results
  })()
}

export { InvalidArgumentError }
