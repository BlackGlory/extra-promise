/**
 * eachList
 *
 * @param  {Array} list
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Array}
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
