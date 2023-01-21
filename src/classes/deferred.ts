import { IDeferred } from '@utils/types.js'

export class Deferred<T> implements PromiseLike<T>, IDeferred<T> {
  private _resolve!: (value: T) => void
  private _reject!: (reason: any) => void
  private promise: Promise<T>

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  get then() {
    return this.promise.then.bind(this.promise)
  }

  resolve(value: T): void {
    this._resolve(value)
  }

  reject(reason: unknown): void {
    this._reject(reason)
  }
}
