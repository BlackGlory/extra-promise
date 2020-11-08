import { delay } from './delay'

export async function pad<T>(ms: number, promise: PromiseLike<T>): Promise<T> {
  const start = Date.now()
  try {
    return await promise
  } finally {
    const elapsed = Date.now() - start
    if (elapsed < ms) await delay(ms)
  }
}
