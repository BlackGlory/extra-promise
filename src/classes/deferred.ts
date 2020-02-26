export class Deferred<T> implements PromiseLike<T> {
  #resolve?: (value?: T) => void
  #reject?: (reason?: any) => void
  #promise: Promise<T>

  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve
      this.#reject = reject
    })
  }

  get then() {
    return this.#promise.then.bind(this.#promise)
  }

  resolve(value?: T): void {
    this.#resolve!(value)
  }

  reject(reason?: any): void {
    this.#reject!(reason)
  }
}
