import each from './each'

/**
 * Convert an iterable object to results through a function.
 * @alias map
 * @method map
 * @async
 * @static
 * @param  {iterable} iterable An iterable object
 * @param  {function} fn A function
 * @param  {number} concurrency The maximum number of concurrency
 * @return {Promise<Array>} Results
 * @example
 * async function oneHundredDividedBy(x) {
 *   return 100 / x
 * }
 *
 * const list = [1, 2, 4]
 *
 * ;(async () => {
 *   const newList = await map(list, oneHundredDividedBy)
 *   console.log(newList)
 *   // [100, 50, 25]
 * })()
 */
export default async function map(iterable, fn = x => x, concurrency = iterable.length) {
  let results = []
  await each(iterable, async x => results.push(await fn(x)), concurrency)
  return results
}
