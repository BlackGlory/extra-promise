export const TIME_ERROR = 1

export function getCalledTimes(fn: jest.Mock): number {
  return fn.mock.calls.length
}

export async function advanceTimersByTime(ms: number) {
  jest.advanceTimersByTime(ms)
  await runAllMicrotasks()
}

export function runAllMicrotasks() {
  return new Promise(resolve => setImmediate(resolve))
}

export class MockIterable<T> implements Iterable<T> {
  nextIndex: number = 0

  constructor(private contents: T[] = []) {}

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.contents.length) {
          this.nextIndex++
          return {
            value: this.contents.shift()
          , done: false
          } as IteratorResult<T> // fuck tsc https://github.com/microsoft/TypeScript/issues/32890
        } else {
          return {
            value: undefined
          , done: true
          } as IteratorResult<T> // fuck tsc https://github.com/microsoft/TypeScript/issues/32890
        }
      }
    }
  }
}
