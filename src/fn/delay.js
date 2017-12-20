/**
 * Wrap an async function as a delayed async function.
 * @param  {function} fn async function
 * @param  {number} timeout delay(ms)
 * @return {function} new async function
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
  return function(...args) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        resolve(await fn.apply(this, args))
      }, timeout)
    })
  }
}
