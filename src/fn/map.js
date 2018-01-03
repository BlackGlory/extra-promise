'use strict'

import each from './each'

/**
 * Convert an iterable object to results through a function.
 *
 * @alias map
 * @method map
 * @async
 * @static
 * @param {iterable} iterable - An iterable object
 * @param {function(v, i)} fn - A function
 * @param {number} concurrency - The maximum number of concurrency
 * @return {Promise<Array>} Results
 * @example
 * function oneHundredDividedBy(v, i) {
 *   return new Promsie(resolve => {
 *     setTimeout(() => {
 *       resolve(100 / v)
 *     }, Math.floor(0 + Math.random() * (2000 + 1 - 0))) // Random 0ms ~ 2000ms
 *   })
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
export default async function map(iterable, fn = (x, i) => x, concurrency = iterable.length) {
  let results = []
  await each(iterable, async (x, i) => results[i] = await fn(x, i), concurrency)
  return results
}
