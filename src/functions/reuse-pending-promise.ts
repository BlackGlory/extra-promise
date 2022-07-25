import stringify from 'fast-json-stable-stringify'
import { HashMap } from '@blackglory/structures'

export function reusePendingPromise<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T> {
  const pendings = new HashMap<Args, Promise<T>>(args => stringify(args))

  return function (this: unknown, ...args: Args): Promise<T> {
    const result = pendings.get(args)
    if (result) {
      return result
    } else {
      const promise = Promise.resolve(fn.apply(this, args))
        .finally(() => pendings.delete(args))
      pendings.set(args, promise)
      return promise
    }
  }
}
