import { Deferred } from './deferred'
import { pass } from '@blackglory/pass'
import { SignalDiscarded } from '@errors'

export class Signal implements PromiseLike<void> {
  private deferred = new Deferred<void>()

  get then() {
    return this.deferred.then.bind(this.deferred)
  }

  emit() {
    this.deferred.resolve()
  }

  discard() {
    Promise.resolve(this.deferred).catch(pass)
    this.deferred.reject(new SignalDiscarded())
  }
}

export { SignalDiscarded } from '@errors'
