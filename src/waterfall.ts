export async function waterfall<T>(tasks: Iterable<(lastResult: any) => unknown | PromiseLike<unknown>>): Promise<T> {
  let result: any
  for (const task of tasks) {
    result = await Promise.resolve(task(result))
  }
  return result
}
