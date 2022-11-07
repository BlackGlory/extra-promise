import { isPromiseLike, isntPromiseLike } from '@functions/is-promise-like'
import { pass } from '@blackglory/pass'

describe('isPromiseLike', () => {
  describe('val is PromiseLike', () => {
    it('return true', () => {
      const obj = { then: pass }

      const result = isPromiseLike(obj)

      expect(result).toBe(true)
    })
  })

  describe('val isnt PromiseLike', () => {
    it('return false', () => {
      const obj = null

      const result = isPromiseLike(obj)

      expect(result).toBe(false)
    })
  })
})

describe('isntPromiseLike', () => {
  describe('val is PromiseLike', () => {
    it('return false', () => {
      const obj = { then: pass }

      const result = isntPromiseLike(obj)

      expect(result).toBe(false)
    })
  })

  describe('val isnt PromiseLike', () => {
    it('return true', () => {
      const obj = null

      const result = isntPromiseLike(obj)

      expect(result).toBe(true)
    })
  })
})
