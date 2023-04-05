import { DebounceMacrotask } from '@classes/debounce-macrotask.js'
import { delay } from '@functions/delay.js'

describe('DebounceMacrotask', () => {
  describe('queue', () => {
    it('fn called once', async () => {
      const dm = new DebounceMacrotask()
      const fn = vi.fn()

      dm.queue(fn)
      dm.queue(fn)
      await delay(0)

      expect(fn).toBeCalledTimes(1)
    })
  })

  describe('cancel', () => {
    it('fn not called', async () => {
      const dm = new DebounceMacrotask()
      const fn = vi.fn()

      dm.queue(fn)
      dm.queue(fn)
      dm.cancel(fn)
      await delay(0)

      expect(fn).not.toBeCalled()
    })
  })
})
