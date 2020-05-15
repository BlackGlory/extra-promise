import { getErrorAsync } from 'return-style'
import { promisify } from '@functions/promisify'
import '@test/matchers'

describe('promisify<Result, Args extends any[] = unknown[]>(fn: (...args: any[]) => unknown): (...args: Args) => Promise<Result>', () => {
  describe('fn resolved', () => {
    it('return resovled Promise', async () => {
      const value = 'value'
      const fn = (value: string, cb: (err: unknown, result: string) => void) => queueMicrotask(() => cb(null, value))

      const promisified = promisify(fn)
      const isFunc = isFunction(promisified)
      const result = promisified(value)
      const proResult = await result

      expect(isFunc).toBe(true)
      expect(result).toBePromise()
      expect(proResult).toBe(value)
    })
  })

  describe('fn rejected', () => {
    it('return rejected Promise', async () => {
      const error = new Error('CustomError')
      const fn = (value: Error, cb: (err: Error) => void) => queueMicrotask(() => cb(value))

      const promisified = promisify(fn)
      const isFunc = isFunction(promisified)
      const result = promisified(error)
      const proResult = await getErrorAsync(result)

      expect(isFunc).toBe(true)
      expect(result).toBePromise()
      expect(proResult).toBe(error)
    })
  })
})

function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}
