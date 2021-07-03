import { isRecord } from '@blackglory/types'

export function isPromiseLike<T>(val: any): val is PromiseLike<T> {
  return isRecord(val) && typeof val.then === 'function'
}
