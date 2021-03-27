import { ExtraPromise } from '@classes/extra-promise'
import { go } from '@utils/go'

export function series(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
): ExtraPromise<void> {
  return go(async () => {
    for (const task of tasks) {
      await task()
    }
  })
}
