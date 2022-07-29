// 相当于reusePendingPromise<T>(() => PromiseLike<T>), 只是没有序列化参数
export function throttleUntilDone<T>(
  fn: () => PromiseLike<T>
): () => Promise<T> {
  let pending: Promise<T> | undefined

  return function (this: unknown): Promise<T> {
    if (!pending) {
      pending = Promise.resolve(fn.apply(this))
        .finally(() => pending = undefined)
    }
    return pending
  }
}
