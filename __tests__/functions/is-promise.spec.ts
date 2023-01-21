import { isPromise, isntPromise } from '@functions/is-promise.js'

describe('isPromise', () => {
  describe('val is Promise', () => {
    it('return true', () => {
      const obj = Promise.resolve()

      const result = isPromise(obj)

      expect(result).toBe(true)
    })
  })

  describe('val isnt Promise', () => {
    it('return false', () => {
      const obj = null

      const result = isPromise(obj)

      expect(result).toBe(false)
    })
  })
})

describe('isntPromise', () => {
  describe('val is Promise', () => {
    it('return false', () => {
      const obj = Promise.resolve()

      const result = isntPromise(obj)

      expect(result).toBe(false)
    })
  })

  describe('val isnt Promise', () => {
    it('return true', () => {
      const obj = null

      const result = isntPromise(obj)

      expect(result).toBe(true)
    })
  })
})
