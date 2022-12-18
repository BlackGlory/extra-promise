import { asyncify } from '@functions/asyncify'
import { Awaitable } from 'justypes'

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
      const result = await addAsync(promiseA, promiseB)

      expect(result).toBe(expected)
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
      const result = await newAddAsync(promiseA, b)

      expect(result).toBe(expected)
    })
  })

  test('eliminate the call stack', async () => {
    const countAsync = asyncify((n: number, i: number = 0): Awaitable<number> => {
      if (i < n) return countAsync(n, i + 1)
      return i
    })

    const result = await countAsync(10000)

    expect(result).toBe(10000)
  })
})
