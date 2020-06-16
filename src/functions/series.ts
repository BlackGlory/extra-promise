export async function series<T>(tasks: Iterable<() => T | PromiseLike<T>>): Promise<void> {
  for (const task of tasks) {
    await task()
  }
}
