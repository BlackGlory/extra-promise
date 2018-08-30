/**
 * Wrap an async function be will only invoke a warning function when Promise
 * status is Rejected without interrupting the running.
 *
 * @param {function} fn - The async function that needs wrap
 * @param {function} buzzer - A function to receive the exception
 * @return {function} The wrapped async function
 * @example
 * const problemMaker = text => Promise.reject(text)
 * const buzzer = e => console.warn(`WARNING: ${ e }`)
 * const problemMakerWithBuzzer = warn(problemMaker, buzzer)
 *
 * ;(async () => {
 *   await problemMakerWithBuzzer('Fire!')
 * })()
 */
export function warn<T>(
  fn: (...args: any[]) => Promise<T>
, buzzer: (err: any) => void = console.warn
) {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (e) {
      buzzer(e)
    }
  }
}

export default warn
