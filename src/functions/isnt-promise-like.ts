import { isPromiseLike } from './is-promise-like'

export function isntPromiseLike<T>(val: T): val is Exclude<T, PromiseLike<unknown>> {
  return !isPromiseLike(val)
}
