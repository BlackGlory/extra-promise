import { getErrorAsync } from 'return-style'
import { Signal, SignalDiscarded } from '@classes/signal'
import '@test/matchers'

describe('Signal', () => {
  describe('constructor', () => {
    it('return PromiseLike<void>', () => {
      const signal = new Signal()

      expect(signal).toBePromiseLike()
    })
  })

  describe('emit(): void', () => {
    it('resolved', async () => {
      const signal = new Signal()

      const result = signal.emit()
      const proResult = await signal

      expect(result).toBeUndefined()
      expect(proResult).toBeUndefined()
    })
  })

  describe('refresh(): void', () => {
    it('The old promise throw SignalDiscarded', async () => {
      const signal = new Signal()

      const oldThen = signal.then
      const oldPromise = oldThen()
      const result = signal.refresh()
      const err = await getErrorAsync(oldPromise)
      const newThen = signal.then

      expect(result).toBeUndefined()
      expect(err).toBeInstanceOf(SignalDiscarded)
      expect(newThen).not.toBe(oldThen)
    })
  })
})
