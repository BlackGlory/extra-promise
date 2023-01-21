import { Deferred } from '@classes/deferred.js'
import { pass } from '@blackglory/pass'
import { IDeferred } from '@utils/types.js'

export class ReusableDeferred<T> implements PromiseLike<T>, IDeferred<T> {
  private deferred: Deferred<T> = this.createDeferred()

  get then() {
    return this.deferred.then.bind(this.deferred)
  }

  resolve(value: T): void {
    // resolve掉上一个Deferred后就立即用新的Deferred覆盖, 下一个ReusableDeferred调用者会阻塞.
    this.deferred.resolve(value)
    this.deferred = this.createDeferred()
  }

  reject(reason: unknown): void {
    // reject掉上一个Deferred后就立即用新的Deferred覆盖, 下一个ReusableDeferred调用者会阻塞.
    this.deferred.reject(reason)
    this.deferred = this.createDeferred()
  }

  private createDeferred() {
    const deferred = new Deferred<T>()
    Promise.resolve(deferred).catch(pass)
    return deferred
  }
}
