import { ExtraPromise } from '@classes/extra-promise'

export function toExtraPromise<T>(promise: PromiseLike<T>): ExtraPromise<T> {
  return new ExtraPromise(async (resolve, reject) => {
    try {
      resolve(await promise)
    } catch (e) {
      reject(e)
    }
  })
}
