import { LazyPromise } from './classes/lazy-promise'

export function lazy<T>(fn: () => T | PromiseLike<T>): LazyPromise<T> {
  return new LazyPromise<T>((resolve, reject) => {
    Promise.resolve(fn()).then(resolve, reject)
  })
}
