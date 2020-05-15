import { Deferred } from './deferred'

export class Signal implements PromiseLike<void> {
  #referred = new Deferred<void>()

  get then() {
    return this.#referred.then.bind(this.#referred)
  }

  emit() {
    this.#referred.resolve()
  }

  refresh() {
    this.#referred.reject(new SignalDiscarded())
    Promise.resolve(this.#referred).catch(() => {})
    this.#referred = new Deferred()
  }
}

export class SignalDiscarded extends Error {
  name = this.constructor.name
}
