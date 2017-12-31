import isPromise from './is-promise'

/**
 * Make asynchronous chained calls easy to write.
 * @method chain
 * @static
 * @param  {Object|function} target A target that needs asynchronous chained calls
 * @return {Proxy<Promise>} The Proxy object that supports asynchronous chained calls
 * @example
 * class Calculator {
 *   constructor(initialValue) {
 *     this.value = initialValue
 *   }
 *
 *   async get() {
 *     return this.value
 *   }
 *
 *   async add(value) {
 *     this.value += value
 *     return this
 *   }
 *
 *   async sub(value) {
 *     this.value -= value
 *     return this
 *   }
 * }
 *
 * ;(async () => {
 *   // use chain()
 *   console.log(
 *     await chain(new Calculator(100))
 *       .add(50)
 *       .sub(100)
 *       .get()
 *   ) // 50
 *
 *   // use await only
 *   console.log(
 *     await (
 *       await (
 *         await (
 *           new Calculator(100).add(50)
 *         )
 *       ).sub(100)
 *     ).get()
 *   ) // 50
 *
 *   // use then() only
 *   new Calculator(100).add(50)
 *     .then(x => x.sub(100))
 *     .then(x => x.get())
 *     .then(console.log) // 50
 * })()
 */
export default function chain(target) {
  class CallableObject extends Function {}

  function wrapper() {
    let lastPromise = Promise.resolve(target)

    const proxy = new Proxy(CallableObject, {
      get(_, prop) {
        if (prop === 'then' || prop === 'catch') {
          return lastPromise[prop].bind(lastPromise)
        } else {
          lastPromise = lastPromise.then(x => x[prop].bind(x))
          return proxy
        }
      }
    , apply(_, caller, args) {
        lastPromise = lastPromise.then(x => x(...args))
        return proxy
      }
    })

    return proxy
  }

  return wrapper()
}
