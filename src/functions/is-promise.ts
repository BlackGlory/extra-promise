export function isPromise<T>(val: unknown): val is Promise<T> {
  return val instanceof Promise
}

export function isntPromise<T>(val: T): val is Exclude<T, Promise<unknown>> {
  return !isPromise(val)
}
