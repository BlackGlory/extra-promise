import { Awaitable } from 'justypes'

type Asyncify<T> = Awaitable<Awaited<T>>

type Promisify<Args extends unknown[]> = {
  [Index in keyof Args]: Asyncify<Args[Index]>
}

export function asyncify<Args extends any[], Result, This = unknown>(
  fn: (this: This, ...args: Args) => Awaitable<Result>
): (this: This, ...args: Promisify<Args>) => Promise<Result> {
  return async function (
    this: This
  , ...args: Promisify<Args>
  ): Promise<Result> {
    await Promise.resolve()
    return Reflect.apply(fn, this, await Promise.all(args))
  }
}
