import { isPromise } from '@functions/is-promise'

describe('isPromise<T>(val: any): boolean', () => {
  describe('val is Promise<T>', () => {
    it('return true', () => {
      const obj = Promise.resolve()

      const result = isPromise(obj)

      expect(result).toBe(true)
    })
  })

  describe('val isnt Promise<T>', () => {
    it('return false', () => {
      const obj = null

      const result = isPromise(obj)

      expect(result).toBe(false)
    })
  })
})
