export function timeout(ms: number): Promise<never> {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new TimeoutError()), ms)
  })
}

export class TimeoutError extends Error {
  name = this.constructor.name
}
