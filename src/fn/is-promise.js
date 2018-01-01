'use strict'

/**
 * Check if an object is a Promise instance.
 * 
 * @alias isPromise
 * @method isPromise
 * @static
 * @param {any} obj - An object needs to be checked
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
