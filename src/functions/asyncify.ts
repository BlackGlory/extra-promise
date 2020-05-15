type Asyncify<T> = T extends PromiseLike<unknown> ? T : T | PromiseLike<T>

type Promisify<T> = {
  [P in keyof T]: Asyncify<T[P]>
}

export function asyncify<T extends any[], U>(fn: (...args: T) => U | PromiseLike<U>): (...args: Promisify<T>) => Promise<U> {
  return async function (this: unknown, ...args: Promisify<T>): Promise<U> {
    return Reflect.apply(fn, this, await Promise.all(args))
  }
}
