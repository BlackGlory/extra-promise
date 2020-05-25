import { debounceMicrotask, cancelMicrotask } from './debounce-microtask'
import { Queue } from './queue'
import { guardForConcurrency, InvalidArgumentError } from './guard-for-concurrency'
import * as EventEmitter from 'eventemitter3'
import { getFailureAsync } from 'return-style'

type Task = () => PromiseLike<void>

export class TaskRunner extends EventEmitter {
  #event = new EventEmitter()
  #queue = new Queue<Task>()
  #pending: number = 0
  #concurrency!: number
  #running: boolean = true

  constructor(concurrency: number = Infinity) {
    super()
    this.setConcurrency(concurrency)

    const go = () => {
      if (!this.#running) return
      while (this.#pending < this.#concurrency && this.#queue.size > 0) {
        const task = this.#queue.dequeue()
        this.run(task)
      }
    }

    this.#event.on('update', () => {
      if (this.#running) debounceMicrotask(go)
    })

    this.#event.on('start', (task: Task) => {
      this.emit('started', task)
    })

    this.#event.on('resolve', (task: Task) => {
      if (this.#running) {
        debounceMicrotask(go)
        this.emit('resolved', task)
      }
    })

    this.#event.on('reject', (task: Task, reason: unknown) => {
      this.#running = false
      cancelMicrotask(go)
      this.emit('rejected', task, reason)
    })
  }

  public setConcurrency(concurrency: number): void {
    guardForConcurrency('concurrency', concurrency)

    this.#concurrency = concurrency
    this.#event.emit('update')
  }

  public add(...tasks: Task[]) {
    this.#queue.enqueue(...tasks)
    this.#event.emit('update')
  }

  private async run(task: Task) {
    this.#pending++
    this.#event.emit('start', task)

    const [fail, reason] = await getFailureAsync(task())

    this.#pending--
    if (fail) {
      this.#event.emit('reject', task, reason)
    } else {
      this.#event.emit('resolve', task)
    }
  }
}

export { InvalidArgumentError }