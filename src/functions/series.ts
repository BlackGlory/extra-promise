import { isIterable } from 'iterable-operator'
import { Awaitable } from 'justypes'

export async function series(
  tasks: Iterable<() => Awaitable<unknown>>
       | AsyncIterable<() => Awaitable<unknown>>
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
