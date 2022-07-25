import { reusePendingPromise } from '@functions/reuse-pending-promise'
import { delay } from '@src/functions/delay'

describe('reusePendingPromise', () => {
  describe('reuse pending promise', () => {
    it('reuses Promsie when pass in same parameters', async () => {
      const fn = jest.fn(async (timeout: number) => {
        await delay(timeout)
        return timeout
      })

      const reusableFn = reusePendingPromise(fn)
      const promise1 = reusableFn(1000)
      const promise2 = reusableFn(1000)
      const result1 = await promise1
      const result2 = await promise2

      expect(promise1).toBe(promise2)
      expect(fn).toBeCalledTimes(1)
      expect(result1).toBe(1000)
      expect(result2).toBe(1000)
    })

    it('does not reuse Promise when pass in different parameters', async () => {
      const fn = jest.fn(async (timeout: number) => {
        await delay(timeout)
        return timeout
      })

      const reusableFn = reusePendingPromise(fn)
      const promise1 = reusableFn(999)
      const promise2 = reusableFn(1000)
      const result1 = await promise1
      const result2 = await promise2

      expect(promise1).not.toBe(promise2)
      expect(fn).toBeCalledTimes(2)
      expect(result1).toBe(999)
      expect(result2).toBe(1000)
    })

    it('does not reuse Promise when it is resolved or rejected', async () => {
      const fn = jest.fn(async (timeout: number) => {
        await delay(timeout)
        return timeout
      })

      const reusableFn = reusePendingPromise(fn)
      const result1 = await reusableFn(1000)
      const result2 = await reusableFn(1000)

      expect(fn).toBeCalledTimes(2)
      expect(result1).toBe(1000)
      expect(result2).toBe(1000)
    })
  })
})
