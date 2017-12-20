/**
 * The elements of a list are converted to asynchronous tasks and return results by factory function, exceptions will save as results.
 * @async
 * @alias mapList
 * @param  {Array} list list
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time
 * @return {Promise<Array>} A list with same indexs
 * @example
 * async function oneHundredDividedBy(x) {
 *   if (x === 0) {
 *     throw new RangeError('Divisor cannot be 0')
 *   }
 *   return 100 / x
 * }
 *
 * const list = [0, 1, 2]
 *
 * ;(async () => {
 *   const newList = await mapList(list, oneHundredDividedBy)
 *   console.log(newList)
 *   // [RangeError('Divisor cannot be 0'), 100, 50]
 * })()
 */
export default async function mapList(list, fn, concurrency = list.length) {
  let results = []
    , nextIndex = concurrency

  async function run(i) {
    try {
      results[i] = await fn(list[i])
    } catch(e) {
      results[i] = e
    }

    if (list.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(list.slice(0, Math.min(list.length, concurrency)).map((e, i) => run(i)))

  return results
}
