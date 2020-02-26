import { sleep } from './sleep'
import { retryUntil } from './retry-until'

interface RetryOpts {
  times?: number
  interval?: number
}

export function retry<Result>(fn: () => Result | PromiseLike<Result>, opts?: RetryOpts): Promise<Result> {
  let times = opts?.times ?? Infinity
  return retryUntil(fn, async () => {
    if (--times < 0) return true
    await sleep(opts?.interval)
  })
}
