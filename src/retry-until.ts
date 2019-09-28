export async function retryUntil<Result, Error = any>(fn: () => Result | PromiseLike<Result>, until: (error: Error) => unknown |  PromiseLike<unknown>): Promise<Result> {
  while (true) {
    try {
      return await Promise.resolve(fn())
    } catch (error) {
      if (await Promise.resolve(until(error))) throw error
    }
  }
}
