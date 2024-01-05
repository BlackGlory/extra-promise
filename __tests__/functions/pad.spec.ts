import { pad } from '@functions/pad.js'
import { getErrorPromise } from 'return-style'
import { TIME_ERROR } from '@test/utils.js'

describe('pad', () => {
  describe('need padding', () => {
    test('pad resolving', async () => {
      const value = 'value'

      const start = Date.now()
      const result = await pad(500, () => Promise.resolve(value))
      const elapsed = Date.now() - start

      expect(result).toBe(value)
      expect(elapsed).toBeGreaterThanOrEqual(500 - TIME_ERROR)
    })

    test('not pad rejecting', async () => {
      const error = new Error('custom error')

      const start = Date.now()
      const result = await getErrorPromise(pad(500, () => Promise.reject(error)))
      const elapsed = Date.now() - start

      expect(result).toBe(error)
      expect(elapsed).toBeLessThan(500 + TIME_ERROR)
    })
  })

  describe('not need padding', () => {
    test('not pad resolving', async () => {
      const value = 'value'

      const start = Date.now()
      const result = await pad(500, () => resolveAfter(500, value))
      const elapsed = Date.now() - start

      expect(result).toBe(value)
      expect(elapsed).toBeGreaterThanOrEqual(500 - TIME_ERROR)
      expect(elapsed).toBeLessThan(1000 + TIME_ERROR)
    })

    test('not pad rejecting', async () => {
      const error = new Error('custom error')

      const start = Date.now()
      const result = await getErrorPromise(pad(500, () => rejectAfter(500, error)))
      const elapsed = Date.now() - start

      expect(result).toBe(error)
      expect(elapsed).toBeGreaterThanOrEqual(500 - TIME_ERROR)
    })
  })
})

function resolveAfter<T>(ms: number, value: T) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

function rejectAfter(ms: number, error: Error) {
  return new Promise((_, reject) => setTimeout(() => reject(error), ms))
}
