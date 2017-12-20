/**
 * The elements of a list are converted to asynchronous tasks and return results by factory function, exceptions will be abort all tasks.
 * @async
 * @alias  everyList
 * @param  {Array} list list
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time, default is all at the same time
 * @return {Promise<Array>} A list with same indexs
 * @example
 * const double = async x => x * 2
 * const list = [1, 2, 3]
 *
 * ;(async () => {
 *   const newList = await everyList(list, double)
 *   console.log(newList)
 *   // [2, 4, 6]
 * })()
 */
export default async function everyList(list, fn, concurrency = list.length) {
  let results = []
    , nextIndex = concurrency

  async function run(i) {
    results[i] = await fn(list[i])

    if (list.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(list.slice(0, Math.min(list.length, concurrency)).map((e, i) => run(i)))

  return results
}
