import { AbortController } from 'extra-fetch'

export function raceAbortSignals(abortSignals: AbortSignal[]): AbortSignal {
  const controller = new AbortController()
  for (const signal of abortSignals) {
    if (signal.aborted) {
      controller.abort()
      break
    } else {
      signal.addEventListener('abort', abort)
    }
  }
  return controller.signal

  function abort() {
    controller.abort()
    abortSignals.forEach(x => x.removeEventListener('abort', abort))
  }
}
