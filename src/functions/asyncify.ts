import { Awaitable } from 'justypes'

type Asyncify<T> = T extends PromiseLike<unknown> ? T : Awaitable<T>

type Promisify<T> = {
  [P in keyof T]: Asyncify<T[P]>
}

export function asyncify<T extends any[], U>(
  fn: (...args: T) => Awaitable<U>
): (...args: Promisify<T>) => Promise<U> {
  return async function (this: unknown, ...args: Promisify<T>): Promise<U> {
    return Reflect.apply(fn, this, await Promise.all(args))
  }
}
