/**
 * warn
 *
 * @return {Promise<any>}
 */
export default function warn(fn, warner = console.warn || console.error || console.log) {
  return async function(...args) {
    try {
      return await fn.apply(this, args)
    } catch(e) {
      await warn(warner)(e)
    }
  }
}
