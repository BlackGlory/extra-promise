/**
 * Wrap an async function as an async function that will only invoke a warning function when Promise status is Rejected without interrupting the running.
 * @param {function} fn async function
 * @param {function} buzzer Function to receive the warning
 * @return {function} new async function
 * @example
 * const problemMaker = text => Promise.reject(text)
 * const buzzer = e => console.warn(`${ new Date() }: ${ e }`)
 * const problemMakerWithBuzzer = warn(problemMaker, buzzer)
 *
 * ;(async () => {
 *   await problemMakerWithBuzzer('Warning!')
 * })()
 */
export default function warn(fn, buzzer = console.warn || console.error || console.log) {
  return async function(...args) {
    try {
      return await fn.apply(this, args)
    } catch(e) {
      await warn(buzzer)(e)
    }
  }
}
