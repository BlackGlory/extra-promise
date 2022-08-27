import { Deferred } from '@classes/deferred'
import { pass } from '@blackglory/pass'

export class ReusableDeferred<T> implements PromiseLike<T> {
  private deferred: Deferred<T> = this.createDeferred()

  get then() {
    return this.deferred.then.bind(this.deferred)
  }

  resolve(value: T): void {
    // resolve掉上一个Deferred后就立即用新的Deferred覆盖, 下一个ReusableDeferred调用者会阻塞.
    this.deferred.resolve(value)
    this.deferred = new Deferred<T>()
  }

  reject(reason: unknown): void {
    // reject掉上一个Deferred后就立即用新的Deferred覆盖, 下一个ReusableDeferred调用者会阻塞.
    this.deferred.reject(reason)
    this.deferred = new Deferred<T>()
  }

  private createDeferred() {
    const deferred = new Deferred<T>()
    Promise.resolve(deferred).catch(pass)
    return deferred
  }
}
