import { raceAbortSignals } from '@functions/race-abort-signals'
import { AbortController } from 'abort-controller'
import 'jest-extended'

describe('raceAbortSignals(abortSignals: Array<AbortSignal | Falsy>): AbortSignal ', () => {
  it('return an AbortSignal', () => {
    const controller = new AbortController()

    const result = raceAbortSignals([controller.signal])
    const isAborted1 = result.aborted
    controller.abort()
    const isAborted2 = result.aborted

    expect(isAborted1).toBeFalse()
    expect(isAborted2).toBeTrue()
  })

  describe('edge: a signal has been aborted', () => {
    it('return an aborted AbortSignal', () => {
      const controller = new AbortController()
      controller.abort()

      const result = raceAbortSignals([controller.signal])

      expect(result).not.toBe(controller.signal)
      expect(result.aborted).toBeTrue()
    })
  })
})
