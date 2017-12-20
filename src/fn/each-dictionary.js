/**
 * The values of a dictionary are converted to asynchronous tasks by factory function, exceptions will be ignored.
 * @async
 * @alias  eachDictionary
 * @param  {Object} dictionary dictionary
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time
 * @return {Promise<void>} Promise state changes to Resolved when all asynchronous tasks have completed
 * @example
 * const printDouble = async x => console.log(x * 2)
 * const dictionary = {
 *   a: 1
 * , b: 2
 * , c: 3
 * }
 *
 * ;(async () => {
 *   await eachDictionary(dictionary, printDouble) // 2 4 6
 * })()
 */
export default async function eachDictionary(dictionary, fn, concurrency = Object.keys(dictionary).length) {
  let keys = Object.keys(dictionary)
    , nextIndex = concurrency

  async function run(i) {
    const key = keys[i]
    try {
      await fn(dictionary[key])
    } catch(e) {}

    if (keys.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(keys.slice(0, Math.min(keys.length, concurrency)).map((key, i) => run(i)))
}
