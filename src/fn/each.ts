'use strict'

/**
 * Traverse an iterable object through a function.
 *
 * @alias  each
 * @method each
 * @param {iterable} iterable - An iterable object
 * @param {function(v, i)} fn - A function
 * @param {number} concurrency The maximum number of concurrency
 * @return {Promise<void>}
 * @example
 * function printDouble(v, i) {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       output(`[${ i }] = ${ v * 2 }`)
 *       resolve()
 *     }, 1000)
 *   })
 * }
 *
 * const list = [1, 2, 3]
 *
 * ;(async () => {
 *   await each(list, printDouble, 1)
 *   // [0] = 2
 *   // [1] = 4
 *   // [2] = 6
 * })()
 */
export async function each(
  iterable: Iterable<any>
, fn = (element: any, index: number) => Promise.resolve(element)
, concurrency = Infinity
) {
  const iterator = iterable[Symbol.iterator]()
  let index = 0

  async function run(value: any, i: number) {
    try {
      await fn(value, i)
    } finally {
      const { value, done } = iterator.next()
      if (!done) {
        await run(value, index++)
      }
    }
  }

  await Promise.all((function*() {
    while (concurrency--) {
      const { value, done } = iterator.next()
      if (done) {
        break
      } else {
        yield run(value, index++)
      }
    }
  })())
}

export default each
