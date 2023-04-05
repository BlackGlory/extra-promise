import { reusePendingPromises } from '@functions/reuse-pending-promises.js'
import { delay } from '@src/functions/delay.js'

describe('reusePendingPromises', () => {
  describe.each([
    ['verbose', reusePendingPromiseVerbose, toVerboseResult]
  , ['not verbose', reusePendingPromises, toValue]
  ])('%s', (_, reusePendingPromise, createResult) => {
    describe('reuse pending promise', () => {
      it('reuses Promsie when pass in same parameters', async () => {
        const fn = vi.fn(async (timeout: number) => {
          await delay(timeout)
          return timeout
        })

        const reusableFn = reusePendingPromise(fn)
        const promise1 = reusableFn(1000)
        const promise2 = reusableFn(1000)
        const result1 = await promise1
        const result2 = await promise2

        expect(fn).toBeCalledTimes(1)
        expect(result1).toStrictEqual(createResult([1000, false]))
        expect(result2).toStrictEqual(createResult([1000, true]))
      })

      it('does not reuse Promise when pass in different parameters', async () => {
        const fn = vi.fn(async (timeout: number) => {
          await delay(timeout)
          return timeout
        })

        const reusableFn = reusePendingPromise(fn)
        const promise1 = reusableFn(999)
        const promise2 = reusableFn(1000)
        const result1 = await promise1
        const result2 = await promise2

        expect(fn).toBeCalledTimes(2)
        expect(result1).toStrictEqual(createResult([999, false]))
        expect(result2).toStrictEqual(createResult([1000, false]))
      })

      it('does not reuse Promise when it is resolved or rejected', async () => {
        const fn = vi.fn(async (timeout: number) => {
          await delay(timeout)
          return timeout
        })

        const reusableFn = reusePendingPromise(fn)
        const result1 = await reusableFn(1000)
        const result2 = await reusableFn(1000)

        expect(fn).toBeCalledTimes(2)
        expect(result1).toStrictEqual(createResult([1000, false]))
        expect(result2).toStrictEqual(createResult([1000, false]))
      })
    })
  })
})

function reusePendingPromiseVerbose<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<[value: T, isReuse: boolean]>{
  return reusePendingPromises(fn, { verbose: true })
}

function toVerboseResult<T>(
  x: [value: T, isReuse: boolean]
): [value: T, isReuse: boolean] {
  return x
}

function toValue<T>([value, _]: [value: T, isReuse: boolean]): T {
  return value
}
