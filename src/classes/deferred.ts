export class Deferred<T> implements PromiseLike<T> {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _resolve!: (value: T) => void
  private _reject!: (reason: any) => void
  private _promise: Promise<T>

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  get then() {
    return this._promise.then.bind(this._promise)
  }

  resolve(value: T): void {
    this._resolve(value)
  }

  reject(reason: unknown): void {
    this._reject(reason)
  }
}
