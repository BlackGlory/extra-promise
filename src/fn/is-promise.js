/**
 * Check if an object is a Promise instance.
 * @alias isPromise
 * @param  {any} obj An object to be checked
 * @return {boolean} Result
 * @example
 * isPromise(Promise.resolve()) // true
 * isPromise(Promise.reject()) // true
 * isPromise(Promise) // false
 * isPromise({ then() {} }) // true
 */
export default function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}
