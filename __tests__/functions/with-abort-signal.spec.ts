import { withAbortSignal, AbortError } from '@functions/with-abort-signal'
import { AbortController } from 'abort-controller'
import { getErrorPromise } from 'return-style'

describe('withAbortSignal<T>(signal: AbortSignal, fn: () => PromiseLike<T>): Promise<T> ', () => {
  describe('signal already aborted', () => {
    it('throw AbortError and fn is not called', async () => {
      const fn = jest.fn()
      const controller = new AbortController()
      controller.abort()

      const err = await getErrorPromise(withAbortSignal(controller.signal, fn))

      expect(err).toBeInstanceOf(AbortError)
      expect(fn).not.toBeCalled()
    })
  })

  describe('signal is aborted after promise is resolved', () => {
    it('return promise result', async () => {
      const value = 1
      const fn = () => Promise.resolve(value)
      const controller = new AbortController()

      setTimeout(() => controller.abort(), 500)
      const result = await withAbortSignal(controller.signal, fn)

      expect(result).toBe(value)
    })
  })

  describe('signal is aborted after promise is rejected', () => {
    it('return promise result', async () => {
      const customError = new Error('custom error')
      const fn = () => Promise.reject(customError)
      const controller = new AbortController()

      setTimeout(() => controller.abort(), 500)
      const err = await getErrorPromise(withAbortSignal(controller.signal, fn))

      expect(err).toBe(customError)
    })
  })

  describe('signal is aborted before promise is resolved', () => {
    it('throw AbortError and fn is called', async () => {
      const fn = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))
      const controller = new AbortController()

      setTimeout(() => controller.abort(), 500)
      const err = await getErrorPromise(withAbortSignal(controller.signal, fn))

      expect(err).toBeInstanceOf(AbortError)
      expect(fn).toBeCalled()
    })
  })

  describe('signal is aborted after promise is rejected', () => {
    it('throw AbortError and fn is called', async () => {
      const customError = new Error('custom error')
      const fn = jest.fn(() => new Promise((_, reject) => reject(customError)))
      const controller = new AbortController()

      setTimeout(() => controller.abort(), 500)
      const err = await getErrorPromise(withAbortSignal(controller.signal, fn))

      expect(err).toBe(customError)
      expect(fn).toBeCalled()
    })
  })
})
