'use strict'

/**
 * Traverse an iterable object through a function.
 * 
 * @alias  each
 * @method each
 * @async
 * @static
 * @param {iterable} iterable - An iterable object
 * @param {function} fn - A function
 * @param {number} concurrency The maximum number of concurrency
 * @return {Promise<void>}
 * @example
 * const printDouble = async x => console.log(x * 2)
 * const list = [1, 2, 3]
 *
 * ;(async () => {
 *   await each(list, printDouble) // 2 4 6
 * })()
 */
export default async function each(iterable, fn = x => x, concurrency = Infinity) {
  const iterator = iterable[Symbol.iterator]()

  async function run(value) {
    try {
      await fn(value)
    } finally {
      const { value, done } = iterator.next()
      if (!done) {
        await run(value)
      }
    }
  }

  await Promise.all((function* () {
    while (concurrency--) {
      const { value, done } = iterator.next()
      if (done) {
        break
      } else {
        yield run(value)
      }
    }
  })())
}
