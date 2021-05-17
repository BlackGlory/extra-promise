import { runAllMicrotasks } from '@test/utils'
import { callbackify } from '@functions/callbackify'
import 'jest-extended'

describe(`
  callbackify<Result, Args extends any[] = unknown[]>(
    fn: (...args: Args) => PromiseLike<Result>
  ): (...args: [...args: Args, callback: Callback<Result>]) => void
`, () => {
  describe('Promise resolved', () => {
    it('call back', async () => {
      const value = 'value'
      const fn = (value: string) => Promise.resolve(value)
      const cb = jest.fn()

      const callbackified = callbackify(fn)
      const result = callbackified(value, cb)
      await runAllMicrotasks()

      expect(callbackified).toBeFunction()
      expect(result).toBeUndefined()
      expect(cb).toBeCalledTimes(1)
      expect(cb).toBeCalledWith(null, value)
    })
  })

  describe('Promise rejected', () => {
    describe('rejected truthy', () => {
      it('call back', async () => {
        const error = new Error('CustomError')
        const fn = (error: Error) => Promise.reject(error)
        const cb = jest.fn()

        const callbackified = callbackify(fn)
        const result = callbackified(error, cb)
        await runAllMicrotasks()

        expect(callbackified).toBeFunction()
        expect(result).toBeUndefined()
        expect(cb).toBeCalledTimes(1)
        expect(cb).toBeCalledWith(error)
      })
    })
  })
})
