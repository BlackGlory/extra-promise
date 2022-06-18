// TypeScript v4.x feature variadic tuple types is not work for `promisify`:
// - https://github.com/microsoft/TypeScript/issues/35641
// - https://github.com/microsoft/TypeScript/issues/39944

type Callback<T> = (err: any, result?: T) => void

export function promisify<Result>(
  fn: (callback: Callback<Result>) => unknown
): () => Promise<Result>
export function promisify<Result, T1>(
  fn: (
    args1: T1
  , callback: Callback<Result>
  ) => unknown
): (args1: T1) => Promise<Result>
export function promisify<Result, T1, T2>(
  fn: (
    args1: T1
  , args2: T2
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2) => Promise<Result>
export function promisify<Result, T1, T2, T3>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6, T7>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  , args7: T7
  , callback: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7) => Promise<Result>
export function promisify<Result>(
  fn: (callback?: Callback<Result>) => unknown
): () => Promise<Result>
export function promisify<Result, T1>(
  fn: (
    args1: T1
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1) => Promise<Result>
export function promisify<Result, T1, T2>(
  fn: (
    args1: T1
  , args2: T2
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2) => Promise<Result>
export function promisify<Result, T1, T2, T3>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6, T7>(
  fn: (
    args1: T1
  , args2: T2
  , args3: T3
  , args4: T4
  , args5: T5
  , args6: T6
  , args7: T7
  , callback?: Callback<Result>
  ) => unknown
): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7) => Promise<Result>
export function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: any[]) => unknown
): (...args: Args) => Promise<Result>
export function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: any[]) => unknown
): (...args: Args) => Promise<Result> {
  return function (this: unknown, ...args: Args) {
    return new Promise<Result>((resolve, reject) => {
      Reflect.apply(fn, this, [
        ...args
      , (err: any, result?: Result) => {
          if (err) return reject(err)
          resolve(result!)
        }
      ])
    })
  }
}
