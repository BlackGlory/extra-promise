import { Awaitable } from 'justypes'
import { go } from '@blackglory/go'

// TypeScript v4.x feature variadic tuple types is not work for `callbackify`:
// - https://github.com/microsoft/TypeScript/issues/35641
// - https://github.com/microsoft/TypeScript/issues/39944

type Callback<T> = (err: any, result?: T) => void

export function callbackify<Result>(
  fn: () => Awaitable<Result>
): (callback: Callback<Result>) => void
export function callbackify<Result, T1>(
  fn: (arg1: T1) => Awaitable<Result>
): (arg1: T1, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2>(
  fn: (
    arg1: T1
  , args2: T2
  ) => Awaitable<Result>
): (arg1: T1, args2: T2, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  ) => Awaitable<Result>
): (arg1: T1, args2: T2, args3: T3, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  ) => Awaitable<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  ) => Awaitable<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5, T6>(
  fn: (
    arg1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  ) => Awaitable<Result>
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
  ) => Awaitable<Result>
): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7, callback: Callback<Result>) => void
export function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => Awaitable<Result>
): (...args: [...Args, Callback<Result>]) => void
export function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => Awaitable<Result>
): (...args: [...Args, Callback<Result>]) => void {
  return function (this: unknown, ...args: [...Args, Callback<Result>]): void {
    const realArgs = args.slice(0, -1) as Args
    const cb = args[args.length - 1] as Callback<Result>

    go(async () => {
      try {
        const result = await Reflect.apply(fn, this, realArgs)
        cb(null, result)
      } catch (e) {
        cb(e)
      }
    })
  }
}
