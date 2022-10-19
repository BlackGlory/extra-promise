import { getErrorPromise } from 'return-style'
import { Signal, SignalDiscarded } from '@classes/signal'
import '@blackglory/jest-matchers'

describe('Signal', () => {
  test('constructor', () => {
    const signal = new Signal()

    expect(signal).toBePromiseLike()
  })

  describe('emit', () => {
    it('The promise resolved', async () => {
      const signal = new Signal()

      const oldThen = signal.then
      const oldPromise = oldThen()
      const result = signal.emit()
      const proResult = await oldPromise
      const newThen = signal.then

      expect(result).toBeUndefined()
      expect(proResult).toBeUndefined()
      expect(newThen).not.toBe(oldThen)
    })
  })

  describe('discard', () => {
    it('The promise rejected SignalDiscarded', async () => {
      const signal = new Signal()

      const oldThen = signal.then
      const oldPromise = oldThen()
      const result = signal.discard()
      const err = await getErrorPromise(oldPromise)
      const newThen = signal.then

      expect(result).toBeUndefined()
      expect(err).toBeInstanceOf(SignalDiscarded)
      expect(newThen).not.toBe(oldThen)
    })
  })
})
