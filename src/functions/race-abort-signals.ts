import { AbortController } from 'extra-fetch'
import { Falsy } from 'justypes'

export function raceAbortSignals(abortSignals: Array<AbortSignal | Falsy>): AbortSignal {
  const controller = new AbortController()
  const subscribedAbortSignals: AbortSignal[] = []
  for (const signal of abortSignals) {
    if (signal) {
      if (signal.aborted) {
        controller.abort()
        break
      } else {
        signal.addEventListener('abort', abort)
        subscribedAbortSignals.push(signal)
      }
    }
  }
  return controller.signal

  function abort() {
    controller.abort()
    subscribedAbortSignals.forEach(x => x.removeEventListener('abort', abort))
  }
}
