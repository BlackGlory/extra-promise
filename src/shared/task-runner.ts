import { debounceMicrotask, cancelMicrotask } from './debounce-microtask'
import { Queue } from './queue'
import { checkConcurrency, InvalidArgumentError } from './check-concurrency'
import { EventEmitter } from 'eventemitter3'
import { getFailureAsync } from 'return-style'

type Task = () => PromiseLike<void>

export class TaskRunner extends EventEmitter {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _event = new EventEmitter()
  private _queue = new Queue<Task>()
  private _pending: number = 0
  private _concurrency!: number
  private _running: boolean = true

  constructor(concurrency: number = Infinity) {
    super()
    this.setConcurrency(concurrency)

    const go = () => {
      if (!this._running) return
      while (this._pending < this._concurrency && this._queue.size > 0) {
        const task = this._queue.dequeue()
        this.run(task)
      }
    }

    this._event.on('update', () => {
      if (this._running) debounceMicrotask(go)
    })

    this._event.on('start', (task: Task) => {
      this.emit('started', task)
    })

    this._event.on('resolve', (task: Task) => {
      if (this._running) {
        debounceMicrotask(go)
        this.emit('resolved', task)
      }
    })

    this._event.on('reject', (task: Task, reason: unknown) => {
      this._running = false
      cancelMicrotask(go)
      this.emit('rejected', task, reason)
    })
  }

  public setConcurrency(concurrency: number): void {
    checkConcurrency('concurrency', concurrency)

    this._concurrency = concurrency
    this._event.emit('update')
  }

  public add(...tasks: Task[]) {
    this._queue.enqueue(...tasks)
    this._event.emit('update')
  }

  private async run(task: Task) {
    this._pending++
    this._event.emit('start', task)

    const [fail, reason] = await getFailureAsync(task)

    this._pending--
    if (fail) {
      this._event.emit('reject', task, reason)
    } else {
      this._event.emit('resolve', task)
    }
  }
}

export { InvalidArgumentError }
