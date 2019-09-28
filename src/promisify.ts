/**
 * Convert a function that needs a callback to async function.
 *
 * @param {function} fn - A function that needs convert
 * @return {function} The converted async function
 * @example
 * const add = (a, b, callback) => callback(null, a + b)
 * const asyncAdd = promisify(add)
 * const result = await asyncAdd(1, 2) // 3
 */
export function promisify<Result = any, Args extends unknown[] = unknown[]>(fn: (...args: any[]) => unknown): (...args: Args) => Promise<Result> {
  return function (...args: Args) {
    return new Promise<Result>((resolve, reject) => {
      fn(...args, (err: unknown, result: Result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}
