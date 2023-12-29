import { stringify } from 'extra-json-stable-stringify'
import { HashMap } from '@blackglory/structures'

type VerboseResult<T> = [value: T, isReuse: boolean]

interface IReusePendingPromisesOptions<Args> {
  createKey?: (args: Args) => unknown
  verbose?: true
}

export function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromisesOptions<Args> & { verbose: true }
): (...args: Args) => Promise<VerboseResult<T>>
export function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromisesOptions<Args> & { verbose: false }
): (...args: Args) => Promise<T>
export function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: Omit<IReusePendingPromisesOptions<Args>, 'verbose'>
): (...args: Args) => Promise<T>
export function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T>
export function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options?: IReusePendingPromisesOptions<Args>
): (...args: Args) => Promise<T | VerboseResult<T>> {
  const pendings = new HashMap<Args, Promise<T>>(options?.createKey ?? stringify)

  return async function (
    this: unknown
  , ...args: Args
  ): Promise<T | VerboseResult<T>> {
    const [value, isReuse] = await reusableFunction.apply(this, args)
    return options?.verbose ? [value, isReuse] : value
  }

  async function reusableFunction(
    this: unknown
  , ...args: Args
  ): Promise<[value: T, reuse: boolean]> {
    const result = pendings.get(args)
    if (result) {
      return [await result, true]
    } else {
      const promise = Promise.resolve(fn.apply(this, args))
        .finally(() => pendings.delete(args))
      pendings.set(args, promise)
      return [await promise, false]
    }
  }
}
