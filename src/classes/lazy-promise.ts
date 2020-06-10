export class LazyPromise<T> implements PromiseLike<T> {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _promise?: Promise<T>
  private _executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    this._executor = executor
  }

  get then() {
    if (!this._promise) this._promise = new Promise<T>(this._executor)
    return this._promise.then.bind(this._promise)
  }
}
