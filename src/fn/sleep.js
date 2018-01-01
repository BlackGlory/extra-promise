'use strict'

/**
 * A setTimeout async function.
 *
 * @method sleep
 * @async
 * @static
 * @param {number} timeout - Timeout(ms)
 * @return {Promise<number>} Elapsed time(ms)
 * @example
 * ;(async () => {
 *   console.log('I will print something in 2s...')
 *   await sleep(2000) // sleep two seconds.
 *   console.log('something')
 * })()
 */
export default function sleep(timeout = 0) {
  const startTime = new Date()
  return new Promise(resolve => setTimeout(() => resolve(new Date() - startTime), timeout))
}
