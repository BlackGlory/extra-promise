/**
 * The elements of a list are converted to asynchronous tasks by factory function, exceptions will be ignored.
 * @async
 * @alias  eachList
 * @param  {Array} list list
 * @param  {function} fn factory function
 * @param  {number} concurrency The number of tasks processed at the same time, default is all at the same time
 * @return {Promise<void>} Promise state changes to Resolved when all asynchronous tasks have completed
 * @example
 * const printDouble = async x => console.log(x * 2)
 * const list = [1, 2, 3]
 *
 * ;(async () => {
 *   await eachList(list, printDouble) // 2 4 6
 * })()
 */
export default async function eachList(list, fn, concurrency = list.length) {
  let nextIndex = concurrency

  async function run(i) {
    try {
      await fn(list[i])
    } catch(e) {}

    if (list.length - 1 >= nextIndex) {
      await run(nextIndex++)
    }
  }

  await Promise.all(list.slice(0, Math.min(list.length, concurrency)).map((e, i) => run(i)))
}
