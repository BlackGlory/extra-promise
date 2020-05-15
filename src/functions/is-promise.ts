export function isPromise<T>(val: any): val is PromiseLike<T> {
  return isObject(val) && typeof val.then === 'function'
}

function isObject(val: any): val is Object {
  const type = typeof val
  return val !== null && (type === 'object' || type === 'function')
}
