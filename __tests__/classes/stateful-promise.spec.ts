import { StatefulPromise, StatefulPromiseState } from '@classes/stateful-promise'
import { getErrorPromise } from 'return-style'
import { setImmediate } from 'extra-timers'

describe('ExtraPromise', () => {
  test('from', async () => {
    const value = 'value'

    const promise = StatefulPromise.from(Promise.resolve(value))
    const result = await promise

    expect(promise).toBeInstanceOf(StatefulPromise)
    expect(result).toBe(value)
  })

  describe('state', () => {
    test('pending', async () => {
      const value = 'value'
      const promise = new StatefulPromise(resolve => setImmediate(() => resolve(value)))

      const result = promise.state

      expect(result).toBe(StatefulPromiseState.Pending)
    })

    test('fulfilled', async () => {
      const value = 'value'
      const promise = new StatefulPromise(resolve => resolve(value))

      await promise
      const result = promise.state

      expect(result).toBe(StatefulPromiseState.Fulfilled)
    })

    test('rejected', async () => {
      const reason = new Error('reason')
      const promise = new StatefulPromise((_, reject) => reject(reason))

      await getErrorPromise(promise)
      const result = promise.state

      expect(result).toBe(StatefulPromiseState.Rejected)
    })
  })

  describe('pending, fulfilled, rejected', () => {
    describe('sync', () => {
      test('fulfilled', async () => {
        const value = 'value'
        const promise = new StatefulPromise(resolve => resolve(value))

        const isPending = promise.isPending()
        const isFulfilled = promise.isFulfilled()
        const isRejected = promise.isRejected()
        const result = await promise

        expect(promise).toBeInstanceOf(Promise)
        expect(isPending).toBe(false)
        expect(isFulfilled).toBe(true)
        expect(isRejected).toBe(false)
        expect(result).toBe(value)
      })

      test('rejected', async () => {
        const reason = new Error('reason')
        const result = new StatefulPromise((_, reject) => reject(reason))

        const isPending = result.isPending()
        const isFulfilled = result.isFulfilled()
        const isRejected = result.isRejected()
        const err = await getErrorPromise(result)

        expect(result).toBeInstanceOf(Promise)
        expect(isPending).toBe(false)
        expect(isFulfilled).toBe(false)
        expect(isRejected).toBe(true)
        expect(err).toBe(reason)
      })
    })

    describe('async', () => {
      test('fulfilled', async () => {
        const value = 'value'
        const promise = new StatefulPromise(resolve => setImmediate(() => resolve(value)))

        const isPending1 = promise.isPending()
        const isFulfilled1 = promise.isFulfilled()
        const isRejected1 = promise.isRejected()
        const result = await promise
        const isPending2 = promise.isPending()
        const isFulfilled2 = promise.isFulfilled()
        const isRejected2 = promise.isRejected()

        expect(promise).toBeInstanceOf(Promise)
        expect(isPending1).toBe(true)
        expect(isFulfilled1).toBe(false)
        expect(isRejected1).toBe(false)
        expect(result).toBe(value)
        expect(isPending2).toBe(false)
        expect(isFulfilled2).toBe(true)
        expect(isRejected2).toBe(false)
      })

      test('rejected', async () => {
        const reason = new Error('reason')
        const result = new StatefulPromise((_, reject) => {
          setImmediate(() => reject(reason))
        })

        const isPending1 = result.isPending()
        const isFulfilled1 = result.isFulfilled()
        const isRejected1 = result.isRejected()
        const err = await getErrorPromise(result)
        const pending2 = result.isPending()
        const isFulfilled2 = result.isFulfilled()
        const isRejected2 = result.isRejected()

        expect(result).toBeInstanceOf(Promise)
        expect(isPending1).toBe(true)
        expect(isFulfilled1).toBe(false)
        expect(isRejected1).toBe(false)
        expect(err).toBe(reason)
        expect(pending2).toBe(false)
        expect(isFulfilled2).toBe(false)
        expect(isRejected2).toBe(true)
      })
    })
  })
})
