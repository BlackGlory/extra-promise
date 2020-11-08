import { pad } from '@functions/pad'
import { getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('pad<T>(ms: number, promise: PromiseLike<T>): Promise<T>', () => {
  describe('need padding', () => {
    it('pad resolving', async () => {
      const value = 'value'

      const start = Date.now()
      const result = pad(500, Promise.resolve(value))
      const proResult = await result
      const elapsed = Date.now() - start

      expect(result).toBePromise()
      expect(proResult).toBe(value)
      expect(elapsed).toBeGreaterThanOrEqual(500)
    })

    it('pad rejecting', async () => {
      const error = new Error('custom error')

      const start = Date.now()
      const result = pad(500, Promise.reject(error))
      const proResult = await getErrorPromise(result)
      const elapsed = Date.now() - start

      expect(result).toBePromise()
      expect(proResult).toBe(error)
      expect(elapsed).toBeGreaterThanOrEqual(500)
    })
  })

  describe('not need padding', () => {
    it('not pad resolving', async () => {
      const value = 'value'

      const start = Date.now()
      const result = pad(500, resolveAfter(500, value))
      const proResult = await result
      const elapsed = Date.now() - start

      expect(result).toBePromise()
      expect(proResult).toBe(value)
      expect(elapsed).toBeWithin(500, 1000)
    })

    it('not pad rejecting', async () => {
      const error = new Error('custom error')

      const start = Date.now()
      const result = pad(500, rejectAfter(500, error))
      const proResult = await getErrorPromise(result)
      const elapsed = Date.now() - start

      expect(result).toBePromise()
      expect(proResult).toBe(error)
      expect(elapsed).toBeGreaterThanOrEqual(500)
    })
  })
})

function resolveAfter<T>(ms: number, value: T) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

function rejectAfter(ms: number, error: Error) {
  return new Promise((_, reject) => setTimeout(() => reject(error), ms))
}
