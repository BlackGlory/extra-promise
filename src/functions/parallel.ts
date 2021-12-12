import { validateConcurrency } from '@utils/validate-concurrency'

export function parallel(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
, concurrency: number = Infinity
): Promise<void> {
  validateConcurrency('concurrency', concurrency)

  return new Promise<void>((resolve, reject) => {
    let total = 0
    let running = 0
    let promisePending = true

    const iterator = tasks[Symbol.iterator]()
    let done: boolean | undefined

    for (let i = 0; !done && i < concurrency; i++) {
      next()
    }

    if (total === 0) return resolve()

    async function next() {
      if (!promisePending) return
      if (done && running === 0) return resolveGracefully()

      let value: () => unknown | PromiseLike<unknown>
      ;({ value, done } = iterator.next())
      if (done) {
        if (running === 0) resolveGracefully()
        return
      }
      const task = value

      total++
      running++
      try {
        await task()
      } catch (e) {
        return rejectGracefully(e)
      }
      running--
      next()
    }

    function resolveGracefully() {
      promisePending = false
      if (!done) {
        iterator.return?.()
      }
      resolve()
    }

    function rejectGracefully(reason: any) {
      promisePending = false
      if (!done) {
        iterator.return?.()
      }
      reject(reason)
    }
  })
}
