'use strict'

import sleep from './sleep'

/**
 * Wrap an async function as a delayed async function.
 *
 * @method delay
 * @static
 * @param {function} fn - An async function that needs wrap
 * @param {number} timeout - delay(ms)
 * @return {function} The wrapped async function
 * @example
 * async function sayHello(name) {
 *   console.log(`${ name }: Hello.`)
 * }
 *
 * const sayHelloAfterOneSecond = delay(sayHello, 1000)
 *
 * ;(async () => {
 *   await sayHelloAfterOneSecond('Jerry')
 *
 *   // same as
 *   await sleep(1000)
 *   await sayHello('Jerry')
 * })()
 */
export default function delay(fn, timeout = 0) {
  return (...args) => sleep(timeout).then(x => fn(...args))
}
