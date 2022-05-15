export class LazyPromise<T> implements PromiseLike<T> {
  private promise?: Promise<T>

  constructor(
    private executor: (
      resolve: (value: T) => void
    , reject: (reason: any) => void
    ) => void
  ) {}

  get then() {
    if (!this.promise) {
      this.promise = new Promise<T>(this.executor)
    }
    return this.promise.then.bind(this.promise)
  }
}
