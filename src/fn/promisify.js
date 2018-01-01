'use strict'

/**
 * Convert a function that needs a callback to async function.
 * 
 * @method promisify
 * @static
 * @param {function} fn - A function that needs convert
 * @return {function} The converted async function
 * @example
 * const add = (a, b, callback) => callback(null, a + b)
 * const asyncAdd = promisify(add)
 * ;(async () => {
 *   const result = await asyncAdd(1, 2) // 3
 * })()
 */
export default function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
