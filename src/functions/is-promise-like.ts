import { isObject, isFunction } from '@blackglory/types'

export function isPromiseLike<T>(val: any): val is PromiseLike<T> {
  return isObject(val)
      && isFunction(val.then)
}
