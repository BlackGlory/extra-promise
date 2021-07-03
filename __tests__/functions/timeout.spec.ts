import { getErrorPromise } from 'return-style'
import { timeout, TimeoutError } from '@functions/timeout'

describe('timeout(ms: number): Promise<never>', () => {
  describe('promise did not timed out', () => {
    it('Promise.race return promise result', async () => {
      const value = 'value'
      const promise = Promise.resolve(value)
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])

      expect(await result).toBe(value)
    })
  })

  describe('promise timed out', () => {
    it('Promise.race throw TimeoutError', async () => {
      const value = 'value'
      const promise = new Promise(resolve => setTimeout(() => resolve(value), 1000))
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])

      expect(await getErrorPromise(result)).toBeInstanceOf(TimeoutError)
    })
  })
})
