import sleep from './sleep'

/**
 * Wrap an async function as a delayed async function.
 *
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

export function delay<T>(fn: (...args: any[]) => T, timeout: number = 0) {
  return (...args: any[]) => sleep(timeout).then(x => fn(...args))
}

export default delay
