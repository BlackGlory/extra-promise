import { delay } from './delay'
import { getErrorResultPromise } from 'return-style'

export async function padResolve<T>(ms: number, promise: PromiseLike<T>): Promise<T> {
  const start = Date.now()
  const [err, res]= await getErrorResultPromise(promise)
  if (err) throw err
  const elapsed = Date.now() - start
  if (elapsed < ms) await delay(ms)
  return res!
}
