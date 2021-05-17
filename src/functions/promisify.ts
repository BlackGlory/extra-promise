type Callback<T> =(err: any, result?: T) => void

export function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: [...args: Args, callback: Callback<Result>]) => unknown
): (...args: Args) => Promise<Result> {
  return function (...args: Args) {
    return new Promise<Result>((resolve, reject) => {
      fn(...args, (err: any, result?: Result) => {
        if (err) return reject(err)
        resolve(result!)
      })
    })
  }
}
