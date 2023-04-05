import { DebounceMicrotask } from '@classes/debounce-microtask.js'

describe('DebounceMicrotask', () => {
  describe('queue', () => {
    it('fn called once', async () => {
      const dm = new DebounceMicrotask()
      const fn = vi.fn()

      dm.queue(fn)
      dm.queue(fn)
      await Promise.resolve()

      expect(fn).toBeCalledTimes(1)
    })
  })

  describe('cancel', () => {
    it('fn not called', async () => {
      const dm = new DebounceMicrotask()
      const fn = vi.fn()

      dm.queue(fn)
      dm.queue(fn)
      dm.cancel(fn)
      await Promise.resolve()

      expect(fn).not.toBeCalled()
    })
  })
})
