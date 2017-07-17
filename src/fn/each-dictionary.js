/**
 * eachDictionary
 *
 * @param  {Object} dictionary
 * @param  {Function} fn
 * @param  {Number} concurrency
 * @return {Object}
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
