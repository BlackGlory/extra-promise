import { Deferred } from './deferred'

export class Signal implements PromiseLike<void> {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _referred = new Deferred<void>()

  get then() {
    return this._referred.then.bind(this._referred)
  }

  emit() {
    this._referred.resolve()
  }

  refresh() {
    this._referred.reject(new SignalDiscarded())
    Promise.resolve(this._referred).catch(() => {})
    this._referred = new Deferred()
  }
}

export class SignalDiscarded extends Error {
  name = this.constructor.name
}
