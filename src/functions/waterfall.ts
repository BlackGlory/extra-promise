import { Awaitable } from 'justypes'

export async function waterfall<T>(
  tasks: Iterable<(result: any) => Awaitable<unknown>>
       | AsyncIterable<(result: any) => Awaitable<unknown>>
): Promise<T | undefined> {
  let result: any
  for await (const task of tasks) {
    result = await task(result)
  }
  return result
}
