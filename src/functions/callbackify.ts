type Callback<T> = (err: any, result?: T) => void

export function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => PromiseLike<Result>
): (...args: [...args: Args, callback: Callback<Result>]) => void {
  return function (...args: [...args: Args, callback: Callback<Result>]): void {
    const realArgs = args.slice(0, -1) as Args
    const cb = args[args.length - 1] as Callback<Result>

    fn(...realArgs).then(
      result => cb(null, result)
    , err => cb(err)
    )
  }
}
