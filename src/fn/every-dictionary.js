/**
 * The values of a dictionary are converted to asynchronous tasks and return results by factory function, exceptions will be abort all tasks.
 * @async
 * @alias everyDictionary
 * @param  {Object} dictionary dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time, default is all at the same time
 * @return {Promise<Object>} A dictionary with same keys
 * @example
 * const double = async x => x * 2
 * const dictionary = {
 *   a: 1
 * , b: 2
 * , c: 3
 * }
 *
 * ;(async () => {
 *   const newDictionary = await everyDictionary(dictionary, double)
 *   console.log(newDictionary)
 *   // { a: 2, b: 4, c: 6 }
 * })()
 */
export default async function everyDictionary(dictionary, fn, concurrency = Object.keys(dictionary).length) {
  let results = {}
    , keys = Object.keys(dictionary)
    , nextIndex = concurrency

  async function run(i) {
    const key = keys[i]
    results[key] = await fn(dictionary[key])

    if (keys.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(keys.slice(0, Math.min(keys.length, concurrency)).map((key, i) => run(i)))

  return results
}
