import { each } from './each'
import { checkConcurrency, InvalidArgumentError } from '@shared/check-concurrency'

export function filter<T, U = T>(iterable: Iterable<T>, fn: (element: T, i: number) => boolean | PromiseLike<boolean>, concurrency: number = Infinity): Promise<U[]> {
  checkConcurrency('concurrency', concurrency)

  return (async () => {
    const results: any[] = []
    await each(iterable, async (x, i) => {
      if (await fn(x, i)) results[i] = x
    }, concurrency)

    // Object.values will drop empty elements: Object.values([1,,,2]) = [1, 2]
    return Object.values(results)
  })()
}

export { InvalidArgumentError }
