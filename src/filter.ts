import each from './each'

/**
 * Filter an iterable object to results through a function.
 *
 * @param {iterable} iterable - An iterable object
 * @param {function(v, i)} fn - A function
 * @param {number} concurrency - The maximum number of concurrency
 * @return {Promise<Array>} Results
 * @example
 *
 * function isEven(num) {
 *   return new Promise(resolve => {
 *     setTimeout(
 *       () => resolve(num % 2 === 0)
 *     , 1000)
 *   })
 * }
 *
 * const list = [1, 2, 3, 4, 5]
 *
 * ;(async () => {
 *   const newList = await filter(list, isEven)
 *   console.log(newList)
 *   // [2, 4]
 * })()
 */
export async function filter(
  iterable: Iterable<any>
, fn: (element: any, index: number) => any | Promise<any> = element => element
, concurrency: number = Infinity
) {
  const results: any[] = []
  await each(iterable, async (x, i) => {
    if (await fn(x, i)) {
      results[i] = x
    }
  }, concurrency)
  return Object.values(results) // Object.values will ignore empty elements.
}

export default filter
