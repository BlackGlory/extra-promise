export async function series(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
): Promise<void> {
  for (const task of tasks) {
    await task()
  }
}
