/**
 * Convert a function that use callback to async functions.
 * @param  {function} fn function
 * @return {function} async function
 * @example
 * const add = (a, b, callback) => callback(a + b)
 * const asyncAdd = promisify(add)
 * ;(async () => {
 *   const result = await asyncAdd(1, 2) // 3
 * })()
 */
export default function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, function(err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}
