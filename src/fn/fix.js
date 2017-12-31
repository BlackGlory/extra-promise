/**
 * Add a fixer to an async function and automatic retry after the fixing.
 * @method fix
 * @static
 * @param {function} fn A fixable async function
 * @param {function} fixer A function can fix fn's problem
 * @return {function} The wrapped async function
 * @example
 */
export default function fix(fn, fixer) {
  return async (...args) => {
    while (true) {
      try {
        return await fn(...args)
      } catch(e) {
        await fixer(e)
      }
    }
  }
}
