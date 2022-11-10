import { isObject, isFunction } from 'extra-utils'

export function isPromiseLike<T>(val: unknown): val is PromiseLike<T> {
  return isObject(val)
      && isFunction(val.then)
}

export function isntPromiseLike<T>(val: T): val is Exclude<T, PromiseLike<unknown>> {
  return !isPromiseLike(val)
}
