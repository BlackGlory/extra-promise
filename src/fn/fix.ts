'use strict'

/**
 * Add a fixer to an async function and automatic retry after the fixing.
 *
 * @method fix
 * @param {function} fn - A fixable async function
 * @param {function} fixer - A function can fix fn's problem
 * @return {function} The wrapped async function
 * @example
 */
export function fix<T>(fn: (...args: any[]) => T, fixer: (err: any) => void) {
  return async (...args: any[]) => {
    while (true) {
      try {
        return await fn(...args)
      } catch(e) {
        await fixer(e)
      }
    }
  }
}

export default fix
