import { ExtraPromise, ExtraPromiseState } from '@classes/extra-promise'
import { getErrorPromise } from 'return-style'
import { setImmediate } from 'extra-timers'

describe('ExtraPromise', () => {
  describe('state', () => {
    test('pending', async () => {
      const value = 'value'
      const promise = new ExtraPromise(resolve => setImmediate(() => resolve(value)))

      const result = promise.state

      expect(result).toBe(ExtraPromiseState.Pending)
    })

    test('fulfilled', async () => {
      const value = 'value'
      const promise = new ExtraPromise(resolve => resolve(value))

      await promise
      const result = promise.state

      expect(result).toBe(ExtraPromiseState.Fulfilled)
    })

    test('rejected', async () => {
      const reason = new Error('reason')
      const promise = new ExtraPromise((_, reject) => reject(reason))

      await getErrorPromise(promise)
      const result = promise.state

      expect(result).toBe(ExtraPromiseState.Rejected)
    })
  })

  describe('pending, fulfilled, rejected', () => {
    describe('sync', () => {
      test('fulfilled', async () => {
        const value = 'value'
        const result = new ExtraPromise(resolve => resolve(value))

        const pending = result.pending
        const fulfilled = result.fulfilled
        const rejected = result.rejected
        const proResult = await result

        expect(result).toBeInstanceOf(Promise)
        expect(pending).toBe(false)
        expect(fulfilled).toBe(true)
        expect(rejected).toBe(false)
        expect(proResult).toBe(value)
      })

      test('rejected', async () => {
        const reason = new Error('reason')
        const result = new ExtraPromise((_, reject) => reject(reason))

        const pending = result.pending
        const fulfilled = result.fulfilled
        const rejected = result.rejected
        const err = await getErrorPromise(result)

        expect(result).toBeInstanceOf(Promise)
        expect(pending).toBe(false)
        expect(fulfilled).toBe(false)
        expect(rejected).toBe(true)
        expect(err).toBe(reason)
      })
    })

    describe('async', () => {
      test('fulfilled', async () => {
        const value = 'value'
        const result = new ExtraPromise(resolve => setImmediate(() => resolve(value)))

        const pending1 = result.pending
        const fulfilled1 = result.fulfilled
        const rejected1 = result.rejected
        const proResult = await result
        const pending2 = result.pending
        const fulfilled2 = result.fulfilled
        const rejected2 = result.rejected

        expect(result).toBeInstanceOf(Promise)
        expect(pending1).toBe(true)
        expect(fulfilled1).toBe(false)
        expect(rejected1).toBe(false)
        expect(proResult).toBe(value)
        expect(pending2).toBe(false)
        expect(fulfilled2).toBe(true)
        expect(rejected2).toBe(false)
      })

      test('rejected', async () => {
        const reason = new Error('reason')
        const result = new ExtraPromise((_, reject) => {
          setImmediate(() => reject(reason))
        })

        const pending1 = result.pending
        const fulfilled1 = result.fulfilled
        const rejected1 = result.rejected
        const err = await getErrorPromise(result)
        const pending2 = result.pending
        const fulfilled2 = result.fulfilled
        const rejected2 = result.rejected

        expect(result).toBeInstanceOf(Promise)
        expect(pending1).toBe(true)
        expect(fulfilled1).toBe(false)
        expect(rejected1).toBe(false)
        expect(err).toBe(reason)
        expect(pending2).toBe(false)
        expect(fulfilled2).toBe(false)
        expect(rejected2).toBe(true)
      })
    })
  })
})
