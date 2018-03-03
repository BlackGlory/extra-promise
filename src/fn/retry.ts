'use strict'

import sleep from './sleep'

/**
 * Wrap an async function as an async function that will retry when meet
 * Rejected, and if it still fails after all retry, return the last exception.
 *
 * @method retry
 * @param {function} fn - An async function that needs wrap
 * @param {number} maxRetries - The maximum number of retries
 * @param {number} retryInterval - Retry interval(ms)
 * @return {function} The wrapped async function
 * @example
 * function threeOrOut() {
 *   let times = 0
 *   return async () => {
 *     times++
 *     if (times < 3) {
 *       throw new Error('need more')
 *     }
 *     return times
 *   }
 * }
 * const threeOrOutWithRetry = retry(threeOrOut(), 3)
 *
 * ;(async () => {
 *   const result = await threeOrOutWithRetry()
 *   console.log(result) // 3
 * })()
 */
export function retry<T>(
  fn: (...args: any[]) => Promise<T>
, maxRetries: number = 1
, retryInterval: number = 0
) {
  return async (...args: any[]) => {
    let lastError
    do {
      try {
        return await fn(...args)
      } catch (e) {
        lastError = e
        await sleep(retryInterval)
      }
    } while (maxRetries--)
    throw lastError
  }
}

export default retry
