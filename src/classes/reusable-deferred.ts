import { Deferred } from '@classes/deferred'

export class ReusableDeferred<T> implements PromiseLike<T> {
  private deferred: Deferred<T> = new Deferred<T>()
  private isFirstRun = true

  get then() {
    return this.deferred.then.bind(this.deferred)
  }

  resolve(value: T): void {
    if (this.isFirstRun) {
      this.deferred.resolve(value)
      this.isFirstRun = false
    } else {
      this.deferred = new Deferred<T>()
      this.deferred.resolve(value)
    }
  }

  reject(reason: unknown): void {
    if (this.isFirstRun) {
      this.deferred.reject(reason)
      this.isFirstRun = false
    } else {
      this.deferred = new Deferred<T>()
      this.deferred.reject(reason)
    }
  }
}
