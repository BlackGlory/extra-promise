import { DebounceMacrotask } from '@classes/debounce-macrotask'
import { delay } from '@functions/delay'

describe('DebounceMacrotask', () => {
  describe('queue', () => {
    it('fn called once', async () => {
      const dm = new DebounceMacrotask()
      const fn = jest.fn()

      dm.queue(fn)
      dm.queue(fn)
      await delay(0)

      expect(fn).toBeCalledTimes(1)
    })
  })

  describe('cancel', () => {
    it('fn not called', async () => {
      const dm = new DebounceMacrotask()
      const fn = jest.fn()

      dm.queue(fn)
      dm.queue(fn)
      dm.cancel(fn)
      await delay(0)

      expect(fn).not.toBeCalled()
    })
  })
})
