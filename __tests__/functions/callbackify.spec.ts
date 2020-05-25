import 'jest-extended'
import { getError } from 'return-style'
import { runAllMicrotasks } from '@test/utils'
import { callbackify, FalsyError, InvalidArgumentsLengthError, InvalidArgumentError } from '@functions/callbackify'

describe('function callbackify<Result, Args extends any[] = unknown[]>(fn: (...args: Args) => PromiseLike<Result>): (...args: Args) => void', () => {
  describe('arguments.length = 0', () => {
    it('throw InvalidArgumentsLengthError', async () => {
      const value = 'value'
      const fn = () => Promise.resolve(value)

      const callbackified = callbackify(fn)
      // @ts-ignore
      const err = getError(() => callbackified())

      expect(callbackified).toBeFunction()
      expect(err).toBeInstanceOf(InvalidArgumentsLengthError)
    })
  })

  describe('The last arugment isnt function', () => {
    it('throw InvalidArgumentError', () => {
      const value = 'value'
      const fn = () => Promise.resolve(value)

      const callbackified = callbackify(fn)
      // @ts-ignore
      const err = getError(() => callbackified(value))

      expect(callbackified).toBeFunction()
      expect(err).toBeInstanceOf(InvalidArgumentError)
    })
  })

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

    describe('rejected falsy', () => {
      it('callback with FalsyError', async () => {
        const error = null
        const fn = (error: unknown) => Promise.reject(error)
        const cb = jest.fn()

        const callbackified = callbackify(fn)
        const result = callbackified(error, cb)
        await runAllMicrotasks()

        expect(callbackified).toBeFunction()
        expect(result).toBeUndefined()
        expect(cb).toBeCalledTimes(1)
        expect(cb).toBeCalledWith(expect.any(FalsyError))
        expect(cb).toBeCalledWith(expect.objectContaining({ reason: error }))
      })
    })
  })
})
