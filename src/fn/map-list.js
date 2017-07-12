/**
 * mapList
 *
 * @param  {Array} list
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Array}
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
