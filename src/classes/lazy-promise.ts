export class LazyPromise<T> implements PromiseLike<T> {
  #promise?: Promise<T>
  #executor: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void

  constructor(executor: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void) {
    this.#executor = executor
  }

  get then() {
    if (!this.#promise) this.#promise = new Promise<T>(this.#executor)
    return this.#promise.then.bind(this.#promise)
  }
}
