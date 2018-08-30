import each from './each'

/**
 * Convert an iterable object to results through a function.
 *
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
export async function map(
  iterable: Iterable<any>
, fn: (element: any, index: number) => any | Promise<any> = element => element
, concurrency: number = Infinity
) {
  const results: any[] = []
  await each(iterable, async (x, i) => results[i] = await fn(x, i), concurrency)
  return results
}

export default map
