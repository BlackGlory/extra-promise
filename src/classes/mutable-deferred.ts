import { Deferred } from '@classes/deferred'

export class MutableDeferred<T> implements PromiseLike<T> {
  private deferred: Deferred<T> = new Deferred<T>()
  private isFirstRun = true

  get then() {
    return this.deferred.then.bind(this.deferred)
  }

  resolve(value: T): void {
    if (this.isFirstRun) {
      this.isFirstRun = false
      this.deferred.resolve(value)
    } else {
      // 用新的Deferred覆盖, 下一个MutableDeferred的调用者会获得新值.
      const deferred = new Deferred<T>()
      deferred.resolve(value)
      this.deferred = deferred
    }
  }

  reject(reason: unknown): void {
    if (this.isFirstRun) {
      this.isFirstRun = false
      this.deferred.reject(reason)
    } else {
      // 用新的Deferred覆盖, 下一个MutableDeferred的调用者会获得新值.
      const deferred = new Deferred<T>()
      deferred.reject(reason)
      this.deferred = deferred
    }
  }
}
