/**
 * A sleep async function.
 * @async
 * @param  {number} timeout = 0 sleep time(ms)
 * @return {Promise<number>} Actual sleep time(ms)
 * @example
 * ;(async () => {
 *   console.log('I will print something in 5s...')
 *   await sleep(5000) // sleep five seconds.
 *   console.log('something')
 * })()
 */
export default function sleep(timeout = 0) {
  const startTime = new Date()
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      resolve(new Date() - startTime)
    }, timeout)
  })
}
