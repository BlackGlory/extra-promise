import { runAllMicrotasks } from '@test/utils'
import { callbackify } from '@functions/callbackify'

describe('callbackify', () => {
  describe('Promise resolved', () => {
    it('calls back', async () => {
      const value = 'value'
      const fn = (value: string) => Promise.resolve(value)
      const cb = jest.fn()

      const callbackified = callbackify(fn)
      const result = callbackified(value, cb)
      await runAllMicrotasks()

      expect(result).toBeUndefined()
      expect(cb).toBeCalledTimes(1)
      expect(cb).toBeCalledWith(null, value)
    })
  })

  describe('Promise rejected', () => {
    describe('rejected truthy', () => {
      it('calls back', async () => {
        const error = new Error('CustomError')
        const fn = (error: Error) => Promise.reject(error)
        const cb = jest.fn()

        const callbackified = callbackify(fn)
        const result = callbackified(error, cb)
        await runAllMicrotasks()

        expect(result).toBeUndefined()
        expect(cb).toBeCalledTimes(1)
        expect(cb).toBeCalledWith(error)
      })
    })
  })

  test('edge case: no args', async () => {
    const value = 'value'
    const fn = () => Promise.resolve(value)
    const cb = jest.fn()

    const callbackified = callbackify(fn)
    const result = callbackified(cb)
    await runAllMicrotasks()

    expect(result).toBeUndefined()
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith(null, value)
  })

  test('edge case: bind', async () => {
    class Foo {
      static value = 'value'

      static async bar() {
        return this.value
      }
    }
    const cb = jest.fn()

    const callbackified = callbackify(Foo.bar).bind(Foo)
    const result = callbackified(cb)
    await runAllMicrotasks()

    expect(result).toBeUndefined()
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith(null, Foo.value)
  })

  test('edge case: sync', async () => {
    const value = 'value'
    const fn = (value: string) => value
    const cb = jest.fn()

    const callbackified = callbackify(fn)
    const result = callbackified(value, cb)
    await runAllMicrotasks()

    expect(result).toBeUndefined()
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith(null, value)
  })
})
