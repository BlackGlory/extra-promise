export function isPromise<T>(val: any): val is Promise<T> {
  return val instanceof Promise
}
