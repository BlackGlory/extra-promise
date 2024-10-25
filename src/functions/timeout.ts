import { CustomError } from '@blackglory/errors'
import { setTimeout } from 'extra-timers'

export function timeout(ms: number, signal?: AbortSignal): Promise<never> {
  return new Promise<never>((_, reject) => {
    signal?.throwIfAborted()

    const clearTimeout = setTimeout(ms, () => reject(new TimeoutError()))

    signal?.addEventListener('abort', () => {
      clearTimeout()
      reject(signal.reason)
    }, { once: true })
  })
}

export class TimeoutError extends CustomError {}
