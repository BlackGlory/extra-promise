/**
 * Check if an object is a Promise instance.
 *
 * @param {any} obj - An object needs to be checked
 * @return {boolean} Result
 * @alias isPromiseLike
 * @example
 * isPromise(Promise.resolve()) // true
 * isPromise(Promise.reject()) // true
 * isPromise({ then() {} }) // true
 * isPromise(Promise) // false
 */
export function isPromise<T>(obj: any): obj is PromiseLike<T> {
  return obj !== null && typeof obj === 'object' && typeof obj.then === 'function'
}
