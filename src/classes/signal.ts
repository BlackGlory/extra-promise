import { CustomError } from '@blackglory/errors'
import { Deferred } from './deferred'

export class Signal implements PromiseLike<void> {
  #deferred = new Deferred<void>()

  get then() {
    return this.#deferred.then.bind(this.#deferred)
  }

  emit() {
    this.#deferred.resolve()
  }

  discard() {
    Promise.resolve(this.#deferred).catch(() => {})
    this.#deferred.reject(new SignalDiscarded())
  }

  refresh() {
    this.#deferred = new Deferred()
  }
}

export class SignalDiscarded extends CustomError {}
