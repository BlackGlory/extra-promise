import { timeoutSignal } from '@functions/timeout-signal'
import { TIME_ERROR } from '@test/utils'
import { waitForEventTarget } from '@blackglory/wait-for'

describe('timeoutSignal(ms: number): AbortSignal', () => {
  it('will abort after `ms` milliseconds', async () => {
    const start = Date.now()

    const signal = timeoutSignal(1000)
    await waitForEventTarget(signal, 'abort')

    expect(signal).toBeInstanceOf(AbortSignal)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
  })
})
