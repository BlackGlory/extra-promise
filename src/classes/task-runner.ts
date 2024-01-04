import { Deferred } from '@classes/deferred.js'
import { DebounceMicrotask } from '@classes/debounce-microtask.js'
import { Queue } from '@blackglory/structures'
import { FiniteStateMachine } from 'extra-fsm'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { Awaitable } from 'justypes'
import { LinkedAbortController, AbortController } from 'extra-abort'
import { CustomError } from '@blackglory/errors'

interface ITask {
  fn: (signal: AbortSignal) => Awaitable<unknown>
  deferred: Deferred<any>
  controller: AbortController
}

export class TaskRunnerDestroyedError extends CustomError {}

export class TaskRunner {
  private fsm = new FiniteStateMachine(
    {
      running: {
        destroy: 'destroyed'
      }
    , destroyed: {}
    }
  , 'running'
  )
  private queue = new Queue<ITask>()
  private runningTasks = new Set<ITask>()
  private debounceMicrotask = new DebounceMicrotask()

  constructor(private concurrency: number = Infinity) {
    validateConcurrency('concurrency', concurrency)
  }

  /**
   * @throws {TaskRunnerDestroyedError}
   */
  async run<T>(fn: (signal: AbortSignal) => Awaitable<T>, signal?: AbortSignal): Promise<T> {
    if (this.fsm.matches('destroyed')) throw new TaskRunnerDestroyedError()
    if (signal?.aborted) throw signal.reason

    const deferred = new Deferred<T>()
    const controller = signal
      ? new LinkedAbortController(signal)
      : new AbortController()
    const task: ITask = {
      fn
    , deferred
    , controller
    }
    this.queue.enqueue(task)
    signal?.addEventListener('abort', () => {
      deferred.reject(signal.reason)
      this.queue.remove(task)
    })

    if (this.fsm.matches('running')) {
      this.debounceMicrotask.queue(this.nextTick)
    }

    return await deferred
  }

  destroy(): void {
    this.fsm.send('destroy')

    this.debounceMicrotask.cancel(this.nextTick)

    const error = new TaskRunnerDestroyedError()

    this.runningTasks.forEach(task => {
      task.controller.abort(error)
    })

    let task: ITask | undefined
    while (task = this.queue.dequeue()) {
      task.deferred.reject(error)
    }
  }

  private nextTick = () => {
    while (
      this.queue.size > 0 &&
      this.runningTasks.size < this.concurrency
    ) {
      const item = this.queue.dequeue()!
      this.process(item)
    }
  }

  private async process(task: ITask): Promise<void> {
    this.runningTasks.add(task)

    try {
      if (task.controller.signal.aborted) throw task.controller.signal.reason
      const result = await task.fn(task.controller.signal)
      task.deferred.resolve(result)
    } catch (e) {
      task.deferred.reject(e)
    }

    this.runningTasks.delete(task)

    if (this.fsm.matches('running')) {
      this.debounceMicrotask.queue(this.nextTick)
    }
  }
}
