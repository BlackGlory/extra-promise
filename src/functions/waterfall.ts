export async function waterfall<T>(
  tasks: Iterable<(result: any) => unknown | PromiseLike<unknown>>
       | AsyncIterable<(result: any) => unknown | PromiseLike<unknown>>
): Promise<T | undefined> {
  let result: any
  for await (const task of tasks) {
    result = await task(result)
  }
  return result
}
