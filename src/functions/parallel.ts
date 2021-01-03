import { checkConcurrency, InvalidArgumentError } from '@shared/check-concurrency'
import { Signal } from '@classes/signal'

export function parallel<T>(tasks: Iterable<() => T | PromiseLike<T>>, concurrency: number = Infinity): Promise<void> {
  checkConcurrency('concurrency', concurrency)

  return new Promise<void>(async (resolve, reject) => {
    let total = 0
    let done = 0
    let running = 0
    let isEnd = false

    const iterator = tasks[Symbol.iterator]()
    let resolved = new Signal()
    while (true) {
      const { value: task, done: end } = iterator.next()
      if (end) {
        isEnd = true
        break
      } else {
        runTask(task)
        total++
        running++
        while (running === concurrency) {
          try {
            await resolved
          } catch {
            return
          } finally {
            resolved = new Signal()
          }
        }
        if (isEnd) return
      }
    }

    if (total === 0) resolve()

    async function runTask(task: () => T | PromiseLike<T>) {
      try {
        await task()
        done++
        running--
        if (isEnd) {
          if (total === done) resolve()
        } else {
          resolved.emit()
        }
      } catch (e) {
        isEnd = true
        resolved.discard()
        reject(e)
      }
    }
  })
}

export { InvalidArgumentError }
