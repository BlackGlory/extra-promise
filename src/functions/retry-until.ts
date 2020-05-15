export async function retryUntil<T, U = unknown>(fn: () => T | PromiseLike<T>, until: (error: U) => boolean | PromiseLike<boolean>): Promise<T> {
  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (await until(error)) throw error
    }
  }
}
