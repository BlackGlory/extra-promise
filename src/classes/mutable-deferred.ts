import { Deferred } from '@classes/deferred.js'
import { pass } from '@blackglory/pass'
import { IDeferred } from '@utils/types.js'

export class MutableDeferred<T> implements PromiseLike<T>, IDeferred<T> {
  private deferred: Deferred<T> = this.createDeferred()
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
      const deferred = this.createDeferred()
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
      const deferred = this.createDeferred()
      deferred.reject(reason)
      this.deferred = deferred
    }
  }

  private createDeferred() {
    const deferred = new Deferred<T>()
    Promise.resolve(deferred).catch(pass)
    return deferred
  }
}
