/**
 * Make asynchronous chained calls easy to write.
 *
 * @param {Object|function} target - A target that needs asynchronous chained calls
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

export function chain(target: any) {
  class CallableObject extends Function {}

  function wrapper() {
    let lastPromise: Promise<any> = Promise.resolve(target)

    const proxy: any = new Proxy(CallableObject, {
      get(_: any, prop: string) {
        if (prop === 'then' || prop === 'catch') {
          return lastPromise[prop].bind(lastPromise)
        } else {
          lastPromise = lastPromise.then(x => x[prop].bind(x))
          return proxy
        }
      }
    , apply(_: any, caller: any, args: any[]) {
        lastPromise = lastPromise.then(x => x(...args))
        return proxy
      }
    })

    return proxy
  }

  return wrapper()
}

export default chain
