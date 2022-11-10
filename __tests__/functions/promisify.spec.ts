import { isFunction } from 'extra-utils'
import { getErrorPromise } from 'return-style'
import { promisify } from '@functions/promisify'
import '@blackglory/jest-matchers'

describe('promisify', () => {
  describe('fn resolved', () => {
    it('returns resovled Promise', async () => {
      const value = 'value'
      const fn = (value: string, cb: (err: unknown, result: string) => void) =>
        queueMicrotask(() => cb(null, value))

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
    it('returns rejected Promise', async () => {
      const error = new Error('CustomError')
      const fn = (value: Error, cb: (err: Error) => void) =>
        queueMicrotask(() => cb(value))

      const promisified = promisify(fn)
      const isFunc = isFunction(promisified)
      const result = promisified(error)
      const proResult = await getErrorPromise(result)

      expect(isFunc).toBe(true)
      expect(result).toBePromise()
      expect(proResult).toBe(error)
    })
  })

  test('edge case: optional callback', async () => {
    const value = 'value'
    const fn = (value: string, cb?: (err: unknown, result: string) => void) =>
      queueMicrotask(() => cb?.(null, value))

    const promisified = promisify(fn)
    const isFunc = isFunction(promisified)
    const result = promisified(value)
    const proResult = await result

    expect(isFunc).toBe(true)
    expect(result).toBePromise()
    expect(proResult).toBe(value)
  })

  test('edge case: no args', async () => {
    const fn = (cb: (err: unknown, result: string) => void) =>
      queueMicrotask(() => cb(null, 'result'))

    const promisified = promisify(fn)
    const isFunc = isFunction(promisified)
    const result = promisified()
    const proResult = await result

    expect(isFunc).toBe(true)
    expect(result).toBePromise()
    expect(proResult).toBe('result')
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
    const result = promisified()
    const proResult = await result

    expect(isFunc).toBe(true)
    expect(result).toBePromise()
    expect(proResult).toBe(Foo.value)
  })
})
