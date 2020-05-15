export async function series<T>(tasks: Iterable<() => T | PromiseLike<T>>): Promise<T[]> {
  const results: T[] = []
  for (const task of tasks) {
    results.push(await task())
  }
  return results
}
