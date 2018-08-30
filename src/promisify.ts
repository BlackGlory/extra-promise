/**
 * Convert a function that needs a callback to async function.
 *
 * @param {function} fn - A function that needs convert
 * @return {function} The converted async function
 * @example
 * const add = (a, b, callback) => callback(null, a + b)
 * const asyncAdd = promisify(add)
 * ;(async () => {
 *   const result = await asyncAdd(1, 2) // 3
 * })()
 */
export function promisify<T>(fn: (...args: any[]) => any) {
  return (...args: any[]) => new Promise<T>((resolve, reject) => {
    fn(...args, (err: any, result: T) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

export default promisify
