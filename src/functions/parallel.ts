import { checkConcurrency, InvalidArgumentError } from '@shared/check-concurrency'
import { ExtraPromise } from '@classes/extra-promise'

export function parallel(tasks: Iterable<() => unknown | PromiseLike<unknown>>, concurrency: number = Infinity): ExtraPromise<void> {
  checkConcurrency('concurrency', concurrency)

  return new ExtraPromise<void>((resolve, reject) => {
    let total = 0
    let running = 0
    let iterableDone = false
    let promisePending = true

    const iterator = tasks[Symbol.iterator]()

    for (let i = 0; !iterableDone && i < concurrency; i++) {
      next()
    }

    if (total === 0) return resolve()

    async function next() {
      if (!promisePending) return
      if (iterableDone && running === 0) return resolveGracefully()

      const result = iterator.next()
      if (result.done) {
        iterableDone = true
        if (running === 0) resolveGracefully()
        return
      }
      const task = result.value

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
      resolve()
    }

    function rejectGracefully(reason: any) {
      promisePending = false
      reject(reason)
    }
  })
}

export { InvalidArgumentError }
