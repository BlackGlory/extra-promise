// TypeScript v4.x feature variadic tuple types is not work for `callbackify`:
// - https://github.com/microsoft/TypeScript/issues/35641
// - https://github.com/microsoft/TypeScript/issues/39944

type Callback<T> = (err: any, result?: T) => void

export function callbackify<Result>(
  fn: () => Promise<Result>
): (callback: Callback<Result>) => void
export function callbackify<Result, T1>(
  fn: (arg1: T1) => Promise<Result>
): (arg1: T1, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2>(
  fn: (
    arg1: T1
  , args2: T2
  ) => Promise<Result>
): (arg1: T1, args2: T2, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  ) => Promise<Result>
): (arg1: T1, args2: T2, args3: T3, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  ) => Promise<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  ) => Promise<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5, T6>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  ) => Promise<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5, T6, T7>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  , args7: T7
  ) => Promise<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7, callback: Callback<Result>) => void
export function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => PromiseLike<Result>
): (...args: Args) => void
export function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => PromiseLike<Result>
): (...args: Args) => void {
  return function (this: unknown, ...args: Args): void {
    const realArgs = args.slice(0, -1) as Args
    const cb = args[args.length - 1] as Callback<Result>

    const promise = Reflect.apply(fn, this, realArgs) as PromiseLike<Result>
    promise.then(
      result => cb(null, result)
    , err => cb(err)
    )
  }
}
