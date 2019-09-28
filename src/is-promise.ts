/**
 * Check if an object is a Promise instance.
 *
 * @param {any} obj - An object needs to be checked
 * @return {boolean} Result
 * @example
 * isPromise(Promise.resolve()) // true
 * isPromise(Promise.reject()) // true
 * isPromise(Promise) // false
 * isPromise({ then() {} }) // true
 */
export function isPromise(obj: any) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function'
}

export default isPromise
