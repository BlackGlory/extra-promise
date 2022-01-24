import { isIterable } from '@blackglory/types'

export async function series(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
       | AsyncIterable<() => unknown | PromiseLike<unknown>>
): Promise<void> {
  if (isIterable(tasks)) {
    for (const task of tasks) {
      await task()
    }
  } else {
    for await (const task of tasks) {
      await task()
    }
  }
}
