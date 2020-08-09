import { getErrorPromise } from 'return-style'
import { timeout, TimeoutError } from '@functions/timeout'
import { advanceTimersByTime } from '@test/utils'

describe('timeout(ms: number): Promise<never>', () => {
  describe('promise did not timed out', () => {
    it('Promise.race return promise result', async () => {
      jest.useFakeTimers()
      const value = 'value'
      const promise = Promise.resolve(value)
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])
      advanceTimersByTime(500)
      const proResult = await result

      expect(proResult).toBe(value)
    })
  })

  describe('promise timed out', () => {
    it('Promise.race throw TimeoutError', async () => {
      jest.useFakeTimers()
      const value = 'value'
      const promise = new Promise(resolve => setTimeout(() => resolve(value), 1000))
      const ms = 500

      const result = Promise.race([promise, timeout(ms)])
      advanceTimersByTime(500)
      const err = await getErrorPromise(result)

      expect(err).toBeInstanceOf(TimeoutError)
    })
  })
})
