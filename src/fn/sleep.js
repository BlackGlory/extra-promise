/**
 * sleep
 *
 * @param  {Number} timeout = 0
 * @return {Promise<Number>}
 */
export default function sleep(timeout = 0) {
  const startTime = new Date()
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      resolve(new Date() - startTime)
    }, timeout)
  })
}
