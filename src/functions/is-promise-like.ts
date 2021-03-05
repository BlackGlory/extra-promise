import { isObject } from '@blackglory/types'

export function isPromiseLike<T>(val: any): val is PromiseLike<T> {
  return isObject(val) && typeof val.then === 'function'
}
