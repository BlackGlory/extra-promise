import sleep from './sleep'

/**
 * Wrap an async function as an async function that will retry when meet Rejected, and if it still fails after all retry, returns an array of all exceptions.
 * @param  {function} fn async function
 * @param  {number} maxRetryCount The maximum number of retries
 * @param  {number} retryInterval Retry interval(ms)
 * @return {function} new async function
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
export default function retry(fn, maxRetryCount = 1, retryInterval = 0) {
  return async function(...args) {
    let errors = []
    for (let i = 0; i <= maxRetryCount; i++) {
      try {
        return await fn.apply(this, args)
      } catch(e) {
        errors.push(e)
        await sleep(retryInterval)
      }
    }
    throw errors
  }
}
