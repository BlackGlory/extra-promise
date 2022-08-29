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

        expect(result).toBeInstanceOf(Promise)
        expect(result.pending).toBe(false)
        expect(result.fulfilled).toBe(true)
        expect(result.rejected).toBe(false)

        const proResult = await result

        expect(proResult).toBe(value)
      })

      test('rejected', async () => {
        const reason = new Error('reason')

        const result = new ExtraPromise((_, reject) => reject(reason))

        expect(result).toBeInstanceOf(Promise)
        expect(result.pending).toBe(false)
        expect(result.fulfilled).toBe(false)
        expect(result.rejected).toBe(true)

        const err = await getErrorPromise(result)

        expect(err).toBe(reason)
      })
    })

    describe('async', () => {
      test('fulfilled', async () => {
        const value = 'value'

        const result = new ExtraPromise(resolve => setImmediate(() => resolve(value)))

        expect(result).toBeInstanceOf(Promise)
        expect(result.pending).toBe(true)
        expect(result.fulfilled).toBe(false)
        expect(result.rejected).toBe(false)

        const proResult = await result

        expect(proResult).toBe(value)
        expect(result.pending).toBe(false)
        expect(result.fulfilled).toBe(true)
        expect(result.rejected).toBe(false)
      })

      test('rejected', async () => {
        const reason = new Error('reason')

        const result = new ExtraPromise((_, reject) => setImmediate(() => reject(reason)))

        expect(result).toBeInstanceOf(Promise)
        expect(result.pending).toBe(true)
        expect(result.fulfilled).toBe(false)
        expect(result.rejected).toBe(false)

        const err = await getErrorPromise(result)

        expect(err).toBe(reason)
        expect(result.pending).toBe(false)
        expect(result.fulfilled).toBe(false)
        expect(result.rejected).toBe(true)
      })
    })
  })
})
