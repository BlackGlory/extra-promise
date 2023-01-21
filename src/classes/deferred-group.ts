import { IDeferred } from '@utils/types.js'

export class DeferredGroup<T> implements IDeferred<T> {
  private group = new Set<IDeferred<T>>()

  add(deferred: IDeferred<T>): void {
    this.group.add(deferred)
  }

  remove(deferred: IDeferred<T>): void {
    this.group.delete(deferred)
  }

  clear(): void {
    for (const deferred of this.group) {
      this.group.delete(deferred)
    }
  }

  resolve(value: T): void {
    for (const deferred of this.group) {
      deferred.resolve(value)
    }
  }

  reject(reason: unknown): void {
    for (const deferred of this.group) {
      deferred.reject(reason)
    }
  }
}
