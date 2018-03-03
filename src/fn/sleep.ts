'use strict'

/**
 * A setTimeout async function.
 *
 * @method sleep
 * @param {number} timeout - Timeout(ms)
 * @return {Promise<number>} Elapsed time(ms)
 * @example
 * ;(async () => {
 *   console.log('I will print something in 2s...')
 *   await sleep(2000) // sleep two seconds.
 *   console.log('something')
 * })()
 */
export function sleep(timeout: number = 0) {
  const startTime = new Date().getTime()
  return new Promise<number>(
    resolve => setTimeout(
      () => resolve(new Date().getTime() - startTime)
    , timeout)
  )
}

export default sleep
