import { isntFunction } from '@blackglory/types'
import { CustomError } from '@blackglory/errors'
import { InvalidArgumentError, InvalidArgumentsLengthError } from '@error'
export { InvalidArgumentError, InvalidArgumentsLengthError }

type ResultCallback<T> = (err: null, result: T) => void
type ErrorCallback = (err: any) => void
type Callback<T> = ErrorCallback & ResultCallback<T>

export function callbackify<Result, T1>(fn: (arg1: T1) => Promise<Result>): (arg1: T1, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2>(fn: (arg1: T1) => Promise<Result>): (arg1: T1, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2>(fn: (arg1: T1, args2: T2) => Promise<Result>): (arg1: T1, args2: T2, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3>(fn: (arg1: T1, args2: T2, args3: T3) => Promise<Result>): (arg1: T1, args2: T2, args3: T3, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4>(fn: (arg1: T1, args2: T2, args3: T3, args4: T4) => Promise<Result>): (arg1: T1, args2: T2, args3: T3, args4: T4, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5>(fn: (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5) => Promise<Result>): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5, T6>(fn: (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6) => Promise<Result>): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, callback: Callback<Result>) => void
export function callbackify<Result, T1, T2, T3, T4, T5, T6, T7>(fn: (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7) => Promise<Result>): (arg1: T1, args2: T2, args3: T3, args4: T4, args5: T5, args6: T6, args7: T7, callback: Callback<Result>) => void
export function callbackify<Result, Args extends any[] = unknown[]>(fn: (...args: Args) => PromiseLike<Result>): (...args: Args) => void
export function callbackify<Result, Args extends any[] = unknown[]>(fn: (...args: Args) => PromiseLike<Result>): (...args: Args) => void {
  return function (...args: Args): void {
    if (args.length === 0) throw new InvalidArgumentsLengthError('a callbackfied function', 1, 0)
    const [realArgs, cb] = sep(args)
    if (isntFunction(cb)) throw new InvalidArgumentError('callback', 'a function')
    fn(...realArgs).then(
      result => cb(null, result)
    , err => cb(err || new FalsyError(err))
    )
  }

  function sep(args: unknown[]): [Args, Callback<Result>] {
    const realArgs = args.slice(0, -1) as Args
    const cb = args[args.length - 1] as Callback<Result>
    return [realArgs, cb]
  }
}

export class FalsyError extends CustomError {
  reason: any

  constructor(val: any) {
    super()
    this.reason = val
  }
}
