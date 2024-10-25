import { setTimeout } from 'extra-timers'

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    signal?.throwIfAborted()

    const clearTimeout = setTimeout(ms, resolve)

    signal?.addEventListener('abort', () => {
      clearTimeout()
      reject(signal.reason)
    }, { once: true })
  })
}
