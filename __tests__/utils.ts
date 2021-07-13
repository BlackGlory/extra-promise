export const TIME_ERROR = 1

export function getCalledTimes(fn: jest.Mock): number {
  return fn.mock.calls.length
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
          } as IteratorResult<T>
        } else {
          return {
            value: undefined
          , done: true
          } as IteratorResult<T>
        }
      }
    }
  }
}

export function runAllMicrotasks() {
  return Promise.resolve()
}

export function advanceTimersByTime(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms + TIME_ERROR))
}
