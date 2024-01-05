import { Deferred } from '@classes/deferred.js'
import { Queue } from '@blackglory/structures'
import { FiniteStateMachine } from 'extra-fsm'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { Awaitable } from 'justypes'
import { LinkedAbortController, AbortController, withAbortSignal, AbortError } from 'extra-abort'
import { assert, CustomError } from '@blackglory/errors'
import { isUndefined, isFinite } from 'extra-utils'
import { delay } from '@src/functions/delay.js'
import { pass } from '@blackglory/pass'

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
  private window?: {
    startTime: number
    count: number
  }
  private scheduleController?: AbortController

  constructor(
    private concurrency: number = Infinity
  , private rateLimit?: {
      duration: number
      limit: number
    }
  ) {
    validateConcurrency('concurrency', concurrency)

    if (rateLimit) {
      assert(
        isFinite(rateLimit.duration) && rateLimit.duration > 0
      , 'The parameter rateLimit.duration must be greater than zero'
      )
      assert(
        isFinite(rateLimit.limit) && rateLimit.limit > 0
      , 'The parameter rateLimit.limit must be greater than zero'
      )
    }
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

    this.schedule()

    return await deferred
  }

  destroy(): void {
    this.fsm.send('destroy')

    this.scheduleController?.abort()

    const error = new TaskRunnerDestroyedError()

    this.runningTasks.forEach(task => {
      task.controller.abort(error)
    })

    let task: ITask | undefined
    while (task = this.queue.dequeue()) {
      task.deferred.reject(error)
    }
  }

  private schedule = async (): Promise<void> => {
    if (this.scheduleController) return

    const controller = new AbortController()
    this.scheduleController = controller
    while (
      this.fsm.matches('running') &&
      !this.scheduleController.signal.aborted &&
      this.queue.size > 0 &&
      this.runningTasks.size < this.concurrency
    ) {
      if (this.rateLimit) {
        if (
          isUndefined(this.window) ||
          (Date.now() - this.window.startTime) >= this.rateLimit.duration
        ) {
          this.window = {
            startTime: Date.now()
          , count: 0
          }
        }

        if (this.window.count < this.rateLimit.limit) {
          this.window.count++
          const item = this.queue.dequeue()!
          this.process(item)
        } else {
          try {
            await this.waitForNextWindow(controller.signal)
          } catch (e) {
            if (e instanceof AbortError) {
              pass()
            } else {
              throw e
            }
          }
        }
      } else {
        const item = this.queue.dequeue()!
        this.process(item)
      }
    }
    this.scheduleController = undefined
  }

  /**
   * @throws {AbortError}
   */
  private async waitForNextWindow(signal: AbortSignal): Promise<void> {
    assert(this.window)
    assert(this.rateLimit)

    const timeout = Math.max(this.rateLimit.duration - (Date.now() - this.window.startTime), 0)
    await withAbortSignal(signal, () => delay(timeout))
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

    this.schedule()
  }
}
