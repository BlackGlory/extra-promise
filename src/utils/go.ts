import { ExtraPromise } from '@classes/extra-promise'

export function go<T>(fn: () => Promise<T>): ExtraPromise<T> {
  return new ExtraPromise(async (resolve, reject) => {
    try {
      resolve(await fn())
    } catch (e) {
      reject(e)
    }
  })
}
