import { isPromiseLike } from '@functions/is-promise-like'
import { pass } from '@blackglory/pass'

describe('isPromiseLike<T>(val: any): boolean', () => {
  describe('val is PromiseLike<T>', () => {
    it('return true', () => {
      const obj = { then: pass }

      const result = isPromiseLike(obj)

      expect(result).toBe(true)
    })
  })

  describe('val isnt PromiseLike<T>', () => {
    it('return false', () => {
      const obj = null

      const result = isPromiseLike(obj)

      expect(result).toBe(false)
    })
  })
})
