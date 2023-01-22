import { DebounceMicrotask } from '@classes/debounce-microtask.js'
import { jest } from '@jest/globals'

describe('DebounceMicrotask', () => {
  describe('queue', () => {
    it('fn called once', async () => {
      const dm = new DebounceMicrotask()
      const fn = jest.fn()

      dm.queue(fn)
      dm.queue(fn)
      await Promise.resolve()

      expect(fn).toBeCalledTimes(1)
    })
  })

  describe('cancel', () => {
    it('fn not called', async () => {
      const dm = new DebounceMicrotask()
      const fn = jest.fn()

      dm.queue(fn)
      dm.queue(fn)
      dm.cancel(fn)
      await Promise.resolve()

      expect(fn).not.toBeCalled()
    })
  })
})
