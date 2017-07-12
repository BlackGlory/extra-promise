import sleep from './sleep'

/**
 * retry
 *
 * @param  {function} fn
 * @param  {number} maxRetryCount = 1
 * @param  {number} retryInterval = 0
 * @return {function}
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
