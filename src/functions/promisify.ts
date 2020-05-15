type ResultCallback<T> = (err: null, result: T) => void
type ErrorCallback = (err: any) => void
type Callback<T> = ErrorCallback & ResultCallback<T>

export function promisify<Result, T1>(fn: (args1: T1, cb: Callback<Result>) => void): (args1: T1) => Promise<Result>
export function promisify<Result, T1, T2>(fn: (args1: T1, args2: T2, cb: Callback<Result>) => void): (args1: T1, args2: T2) => Promise<Result>
export function promisify<Result, T1, T2, T3>(fn: (args1: T1, args2: T2, args3: T3, cb: Callback<Result>) => void): (args1: T1, args2: T2, args3: T3) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4>(fn: (args1: T1, args2: T2, args3: T3, args4: T4, cb: Callback<Result>) => void): (args1: T1, args2: T2, args3: T3, args4: T4) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5>(fn: (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, cb: Callback<Result>) => void): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6>(fn: (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, cb: Callback<Result>) => void): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6) => Promise<Result>
export function promisify<Result, T1, T2, T3, T4, T5, T6, T7>(fn: (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7, cb: Callback<Result>) => void): (args1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7) => Promise<Result>
export function promisify<Result, Args extends any[] = unknown[]>(fn: (...args: any[]) => unknown): (...args: Args) => Promise<Result>
export function promisify<Result, Args extends any[] = unknown[]>(fn: (...args: any[]) => unknown): (...args: Args) => Promise<Result> {
  return function (...args: Args) {
    return new Promise<Result>((resolve, reject) => {
      fn(...args, (err: unknown, result: Result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}
