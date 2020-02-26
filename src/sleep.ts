/**
 * A setTimeout async function.
 *
 * @param {number} timeout - Timeout(ms)
 * @return {Promise<number>} Elapsed time(ms)
 * @example
 * await sleep(2000) // sleep two seconds.
 */
export function sleep(timeout: number = 0) {
  const startTime = getTimestamp()
  return new Promise<number>(resolve => {
    setTimeout(() => resolve(getTimestamp() - startTime), timeout)
  })
}

function getTimestamp() {
  return new Date().getTime()
}
