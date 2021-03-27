export async function waterfall<T>(
  tasks: Iterable<(result: any) => unknown | PromiseLike<unknown>>
): Promise<T | undefined> {
  let result: any
  for (const task of tasks) {
    result = await task(result)
  }
  return result
}
