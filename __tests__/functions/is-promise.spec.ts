import { isPromise } from '@functions/is-promise'

describe('isPromise<T>(val: any): boolean', () => {
  describe('val is PromiseLike<T>', () => {
    it('return true', () => {
      const obj = { then() {} }

      const result = isPromise(obj)

      expect(result).toBe(true)
    })
  })

  describe('val isnt PromiseLike<T>', () => {
    it('return false', () => {
      const obj = null

      const result = isPromise(obj)

      expect(result).toBe(false)
    })
  })
})
