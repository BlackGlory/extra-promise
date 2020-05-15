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
