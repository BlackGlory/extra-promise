import { retryUntil } from './retry-until'

export function retryForever<T>(
  fn: () => T | PromiseLike<T>
, fatalErrors: Array<new (...args: any) => Error> = []
): Promise<T> {
  return retryUntil(fn, e => {
    if (fatalErrors.some(x => e instanceof x)) return true
    return false
  })
}
