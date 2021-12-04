import { Deferred } from '@classes/deferred'

export class ReusableDeferred<T> implements PromiseLike<T> {
  #deferred: Deferred<T> = new Deferred<T>()
  #used = false

  get then() {
    return this.#deferred.then.bind(this.#deferred)
  }

  resolve(value: T): void {
    if (this.#used) {
      this.#deferred = new Deferred<T>()
    }
    this.#deferred.resolve(value)
    this.#used = true
  }

  reject(reason: unknown): void {
    if (this.#used) {
      this.#deferred = new Deferred<T>()
    }
    this.#deferred.reject(reason)
    this.#used = true
  }
}
