import { validateConcurrency } from '@utils/validate-concurrency.js'
import { Awaitable } from 'justypes'

export function parallel(
  tasks: Iterable<() => Awaitable<unknown>>
, concurrency: number = Infinity
): Promise<void> {
  validateConcurrency('concurrency', concurrency)

  return new Promise<void>((resolve, reject) => {
    let running = 0
    let promisePending = true

    const iterator = tasks[Symbol.iterator]()
    let done: boolean | undefined

    for (let i = 0; !done && i < concurrency; i++) {
      next()
    }

    async function next() {
      if (!promisePending) return
      if (done && running === 0) return resolveGracefully()

      let value: () => Awaitable<unknown>
      try {
        ({ value, done } = iterator.next())
      } catch (e) {
        return rejectGracefully(e)
      }
      if (done) {
        if (running === 0) resolveGracefully()
        return
      }
      const task = value

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
