/**
 * The values of a dictionary are converted to asynchronous tasks and return results by factory function, exceptions will save as results.
 * @async
 * @alias mapDictionary
 * @param  {Object} dictionary dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time
 * @return {Promise<Object>} A dictionary with same keys
 * @example
 * async function oneHundredDividedBy(x) {
 *   if (x === 0) {
 *     throw new RangeError('Divisor cannot be 0')
 *   }
 *   return 100 / x
 * }
 *
 * const dictionary = {
 *   a: 0
 * , b: 1
 * , c: 2
 * }
 *
 * ;(async () => {
 *   const newDictionary = await mapDictionary(dictionary, oneHundredDividedBy)
 *   console.log(newDictionary)
 *   // { a: RangeError('Divisor cannot be 0'), b: 100, c: 50 }
 * })()
 */
export default async function mapDictionary(dictionary, fn, concurrency = Object.keys(dictionary).length) {
  let results = {}
    , keys = Object.keys(dictionary)
    , nextIndex = concurrency

  async function run(i) {
    const key = keys[i]
    try {
      results[key] = await fn(dictionary[key])
    } catch(e) {
      results[key] = e
    }

    if (keys.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(keys.slice(0, Math.min(keys.length, concurrency)).map((key, i) => run(i)))

  return results
}
