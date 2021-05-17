type ResultCallback<T> = (err: null, result: T) => void
type ErrorCallback = (err: any) => void
type Callback<T> = ErrorCallback | ResultCallback<T>

export function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: [...args: Args, callback: Callback<Result>]) => unknown
): (...args: Args) => Promise<Result> {
  return function (...args: Args) {
    return new Promise<Result>((resolve, reject) => {
      fn(...args, (err: unknown, result: Result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}
