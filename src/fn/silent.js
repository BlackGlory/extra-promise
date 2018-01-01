'use strict'

/**
 * Wrap an async function as an async function that will never throw an exception.
 *
 * @method silent
 * @static
 * @param {function} fn - The async function that needs wrap
 * @return {function} The wrapped async function
 * @example
 * async function noiseMaker() {
 *   throw new Error('New problem!')
 * }
 *
 * const silentMaker = pass(noiseMaker)
 *
 * ;(async () => {
 *   await silentMaker()
 *   console.log('Wow! no problem?')
 * })()
 */
export default function silent(asyncFn) {
  return (...args) => asyncFn(...args).catch(() => {})
}
