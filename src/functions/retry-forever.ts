import { retryUntil } from './retry-until'

export function retryForever<T>(fn: () => T | PromiseLike<T>): Promise<T> {
  return retryUntil(fn, () => false)
}
