/**
 * everyList
 *
 * @param  {Array} list
 * @param  {Function} fn
 * @param  {Number} concurrency = list.length
 * @return {Array}
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
