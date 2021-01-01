import { retryUntil } from './retry-until'

export function retryCount<T>(fn: () => T | PromiseLike<T>, maximum: number): Promise<T> {
  let count = 0
  return retryUntil(fn, () => count++ < maximum)
}
