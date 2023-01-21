import { delay } from './delay.js'
import { getErrorResultAsync } from 'return-style'
import { Awaitable } from 'justypes'

export async function pad<T>(ms: number, fn: () => Awaitable<T>): Promise<T> {
  const start = Date.now()
  const [err, res]= await getErrorResultAsync(async () => fn())
  if (err) throw err

  const elapsed = Date.now() - start
  if (elapsed < ms) {
    await delay(ms)
  }

  return res!
}
