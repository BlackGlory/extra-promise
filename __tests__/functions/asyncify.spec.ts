import { asyncify } from '@functions/asyncify'
import '@blackglory/jest-matchers'

describe('asyncify', () => {
  describe('fn does not accept promises', () => {
    it('returns asyncified fn', async () => {
      const add = (a: number, b: number) => a + b
      const a = 1
      const b = 2
      const expected = add(a, b)
      const promiseA = Promise.resolve(a)
      const promiseB = Promise.resolve(b)

      const addAsync = asyncify(add)
      const result = addAsync(promiseA, promiseB)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(expected)
    })
  })

  describe('fn accepts promises', () => {
    it('returns asyncified fn', async () => {
      const addAsync = async (a: number, b: PromiseLike<number>) => a + await b
      const a = 1
      const b = Promise.resolve(2)
      const expected = await addAsync(a, b)
      const promiseA = Promise.resolve(a)

      const newAddAsync = asyncify(addAsync)
      const result = newAddAsync(promiseA, b)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBe(expected)
    })
  })
})
