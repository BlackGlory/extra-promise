import { isFunction } from 'extra-utils'
import { getErrorPromise } from 'return-style'
import { promisify } from '@functions/promisify'

describe('promisify', () => {
  describe('fn resolved', () => {
    it('returns resovled Promise', async () => {
      const value = 'value'
      const fn = (value: string, cb: (err: unknown, result: string) => void) =>
        queueMicrotask(() => cb(null, value))

      const promisified = promisify(fn)
      const isFunc = isFunction(promisified)
      const result = await promisified(value)

      expect(isFunc).toBe(true)
      expect(result).toBe(value)
    })
  })

  describe('fn rejected', () => {
    it('returns rejected Promise', async () => {
      const error = new Error('CustomError')
      const fn = (value: Error, cb: (err: Error) => void) =>
        queueMicrotask(() => cb(value))

      const promisified = promisify(fn)
      const isFunc = isFunction(promisified)
      const result = await getErrorPromise(promisified(error))

      expect(isFunc).toBe(true)
      expect(result).toBe(error)
    })
  })

  test('edge case: optional callback', async () => {
    const value = 'value'
    const fn = (value: string, cb?: (err: unknown, result: string) => void) =>
      queueMicrotask(() => cb?.(null, value))

    const promisified = promisify(fn)
    const isFunc = isFunction(promisified)
    const result = await promisified(value)

    expect(isFunc).toBe(true)
    expect(result).toBe(value)
  })

  test('edge case: no args', async () => {
    const fn = (cb: (err: unknown, result: string) => void) =>
      queueMicrotask(() => cb(null, 'result'))

    const promisified = promisify(fn)
    const isFunc = isFunction(promisified)
    const result = await promisified()

    expect(isFunc).toBe(true)
    expect(result).toBe('result')
  })

  test('edge case: bind', async () => {
    class Foo {
      static value = 'value'

      static bar(cb: (err: unknown, result: string) => void) {
        queueMicrotask(() => cb(null, this.value))
      }
    }

    const promisified = promisify(Foo.bar).bind(Foo)
    const isFunc = isFunction(promisified)
    const result = await promisified()

    expect(isFunc).toBe(true)
    expect(result).toBe(Foo.value)
  })
})
