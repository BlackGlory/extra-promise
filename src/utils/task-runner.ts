import { getError } from 'return-style'
import { each } from 'iterable-operator'
import { debounceMicrotask, cancelMicrotask } from './microtask'
import { Queue } from './queue'

export type Task<T> = () => T | PromiseLike<T>

type EventName = 'completed' | 'error'
type EventCompletedCallback = () => void
type EventErrorCallback = (error: any) => void
type EventCallback = EventCompletedCallback | EventErrorCallback

export class TaskRunner {
  #queue = new Queue<Task<unknown>>()
  #running: number = 0
  #eventListeners: { [index: string]: Set<EventCallback> }= {}
  #concurrency: number
  #status = new PauseStatus(false)

  constructor(concurrency: number = Infinity) {
    this.#concurrency = concurrency
  }

  get concurrency(): number {
    return this.#concurrency
  }

  set concurrency(val: number) {
    if (val < 1) throw new Error('concurrency is at least 1')
    if (!Number.isInteger(val)) throw new Error('concurrency must be integer')
    this.#concurrency = val
    /* istanbul ignore else */
    if (this.isntPause()) this.debounceConsume()
  }

  add(...tasks: Task<unknown>[]) {
    this.#queue.enqueue(...tasks)
    if (this.isntPause()) this.debounceConsume()
    return this
  }

  once(eventName: EventName, callback: EventCallback) {
    /* istanbul ignore else */
    if (!isSet(this.#eventListeners[eventName])) this.#eventListeners[eventName] = new Set()
    this.#eventListeners[eventName].add(callback)
    return this
  }

  pause() {
    this.#status.pause()
    this.cancelConsume()
    return this
  }

  resume() {
    this.#status.resume()
    this.debounceConsume()
    return this
  }

  withdraw() {
    const result: Task<unknown>[] = []
    while (this.#queue.size > 0) {
      result.push(this.#queue.dequeue())
    }
    return result
  }

  private emit(eventName: EventName, data?: unknown): void {
    /* istanbul ignore else */
    if (isSet(this.#eventListeners[eventName])) {
      each(this.#eventListeners[eventName], cb => cb(data))
      this.#eventListeners[eventName].clear()
    }
  }

  private debounceConsume() {
    debounceMicrotask(this.#consume)
  }

  private cancelConsume() {
    cancelMicrotask(this.#consume)
  }

  #consume = (() => {
    if (this.isIdle()) return this.complete()
    while (this.canRun()) {
      const task = this.#queue.dequeue()
      this.run(task)
    }
  }).bind(this)

  private async run(task: Task<unknown>) {
    this.#running++
    const err = await getError(task)
    this.#running--
    if (err) return this.error(err)
    /* istanbul ignore else */
    if (this.isntPause()) this.debounceConsume()
  }

  private complete() {
    this.emit('completed')
  }

  private error(error: unknown) {
    this.emit('error', error)
    this.pause()
  }

  private isIdle() {
    return this.#running === 0 && this.isQueueEmpty()
  }

  private isQueueEmpty() {
    return this.#queue.size === 0
  }

  private isntPause() {
    return this.#status.isntPause()
  }

  private canRun() {
    return this.isntPause() && this.#running < this.concurrency && !this.isQueueEmpty()
  }
}

function isSet<T>(val: unknown): val is Set<T> {
  return val instanceof Set
}

class PauseStatus {
  #pause: boolean

  constructor(initVal: boolean) {
    this.#pause = initVal
  }

  pause() {
    this.#pause = true
  }

  resume() {
    this.#pause = false
  }

  isntPause() {
    return !this.isPause()
  }

  isPause() {
    return this.#pause
  }
}
