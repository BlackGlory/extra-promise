import { DebounceMicrotask } from '@classes/debounce-microtask'
import { Queue } from '@blackglory/structures'
import { checkConcurrency, InvalidArgumentError } from '@shared/check-concurrency'
import { EventEmitter } from 'eventemitter3'
import { toResultAsync, getError } from 'return-style'

export type Task<T> = () => PromiseLike<T>

export class TaskRunner<T> extends EventEmitter {
  #internalEvents = new EventEmitter()
  #queue = new Queue<Task<T>>()
  #pending: number = 0
  #concurrency!: number
  #running: boolean = true
  #debounceMicrotask = new DebounceMicrotask()

  constructor(concurrency: number = Infinity) {
    super()
    this.setConcurrency(concurrency)

    const consume = () => {
      if (!this.#running) return
      while (this.#pending < this.#concurrency && this.#queue.size > 0) {
        const task = this.#queue.dequeue()
        this.run(task)
      }
    }

    this.#internalEvents.on('update', () => {
      if (this.#running) this.#debounceMicrotask.queue(consume)
    })

    this.#internalEvents.on('start', (task: Task<T>) => {
      this.emit('started', task)
    })

    this.#internalEvents.on('resolve', (task: Task<T>, result: T) => {
      this.emit('resolved', task, result)
      if (this.#running) this.#debounceMicrotask.queue(consume)
    })

    this.#internalEvents.on('reject', (task: Task<T>, reason: unknown) => {
      this.#internalEvents.emit('pause')
      this.emit('rejected', task, reason)
    })

    this.#internalEvents.on('pause', () => {
      this.#running = false
      this.#debounceMicrotask.cancel(consume)
    })

    this.#internalEvents.on('resume', () => {
      if (!this.#running) {
        this.#running = true
        this.#debounceMicrotask.queue(consume)
      }
    })
  }

  setConcurrency(concurrency: number): void {
    checkConcurrency('concurrency', concurrency)

    this.#concurrency = concurrency
    this.#internalEvents.emit('update')
  }

  push(...tasks: Task<T>[]): void {
    this.#queue.enqueue(...tasks)
    this.#internalEvents.emit('update')
  }

  pause(): void {
    this.#internalEvents.emit('pause')
  }

  resume(): void {
    this.#internalEvents.emit('resume')
  }

  clear(): void {
    this.#queue.empty()
  }

  private async run(task: Task<T>): Promise<void> {
    this.#pending++
    this.#internalEvents.emit('start', task)

    const result = await toResultAsync(task)

    this.#pending--
    if (result.isOk()) {
      this.#internalEvents.emit('resolve', task, result.get())
    } else {
      this.#internalEvents.emit('reject', task, getError(() => result.get()))
    }
  }
}

export { InvalidArgumentError }
