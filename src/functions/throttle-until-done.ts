// 相当于throttleConcurrency(1, fn)的特殊版本, 它会在多次调用中返回首次调用时返回的Promise.
export function throttleUntilDone<T>(fn: () => PromiseLike<T>): () => Promise<T> {
  let pending: Promise<T> | undefined

  return function (this: unknown): Promise<T> {
    if (!pending) {
      pending = Promise.resolve(fn.apply(this))
        .finally(() => pending = undefined)
    }
    return pending
  }
}
