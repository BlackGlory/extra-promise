import { Deferred } from '@classes/deferred.js'
import { DebounceMicrotask } from '@classes/debounce-microtask.js'
import { Queue } from '@blackglory/structures'
import { FiniteStateMachine } from 'extra-fsm'
import { validateConcurrency } from '@utils/validate-concurrency.js'
import { Awaitable } from 'justypes'

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
  private queue = new Queue<[() => Awaitable<unknown>, Deferred<any>]>()
  private pending: number = 0
  private debounceMicrotask = new DebounceMicrotask()

  constructor(private concurrency: number = Infinity) {
    validateConcurrency('concurrency', concurrency)
  }

  async run<T>(task: () => Awaitable<T>): Promise<T> {
    if (this.fsm.matches('destroyed')) throw new Error('TaskRunner has been destroyed.')

    const deferred = new Deferred<T>()
    this.queue.enqueue([task, deferred])
    if (this.fsm.matches('running')) {
      this.debounceMicrotask.queue(this.nextTick)
    }
    return await deferred
  }

  destroy(): void {
    this.fsm.send('destroy')

    this.debounceMicrotask.cancel(this.nextTick)
    this.queue.empty()
  }

  private nextTick = () => {
    while (
      this.queue.size > 0 &&
      this.pending < this.concurrency
    ) {
      const [task, deferred] = this.queue.dequeue()!
      this.process(task, deferred)
    }
  }

  private async process<T>(
    task: () => Awaitable<T>
  , deferred: Deferred<T>
  ): Promise<void> {
    this.pending++

    try {
      const result = await task()
      deferred.resolve(result)
    } catch (e) {
      deferred.reject(e)
    }

    this.pending--

    if (this.fsm.matches('running')) {
      this.debounceMicrotask.queue(this.nextTick)
    }
  }
}
