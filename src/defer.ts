export function defer<T>() {
  let resolveCallback: (value?: T | PromiseLike<T>) => void
    , rejectCallback: (reason?: any) => void
  const promise = new Promise<T>((resolve, reject) => {
    resolveCallback = resolve
    rejectCallback = reject
  })
  return Object.assign(
    [promise, resolveCallback!, rejectCallback!] as [
      Promise<T>
    , (value?: T | PromiseLike<T>) => void
    , (reason?: any) => void
    ]
  , { promise, resolve: resolveCallback!, reject: rejectCallback! }
  )
}
