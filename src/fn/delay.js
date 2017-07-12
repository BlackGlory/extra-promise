/**
 * delay
 *
 * @param  {function} fn
 * @param  {number} timeout = 0
 * @return {function}
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
