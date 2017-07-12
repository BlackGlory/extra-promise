/**
 * everyDictionary
 *
 * @param  {Object} dictionary
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Object}
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
