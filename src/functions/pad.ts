import { delay } from './delay'
import { getErrorResultAsync } from 'return-style'

export async function pad<T>(ms: number, fn: () => T | PromiseLike<T>): Promise<T> {
  const start = Date.now()
  const [err, res]= await getErrorResultAsync(async () => fn())
  if (err) throw err
  const elapsed = Date.now() - start
  if (elapsed < ms) await delay(ms)
  return res!
}
