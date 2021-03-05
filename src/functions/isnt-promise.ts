import { isPromise } from './is-promise'

export function isntPromise<T>(val: T): val is Exclude<T, Promise<unknown>> {
  return !isPromise(val)
}
