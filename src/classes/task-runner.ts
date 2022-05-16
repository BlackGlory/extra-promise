import { Deferred } from '@classes/deferred'
import { DebounceMicrotask } from '@classes/debounce-microtask'
import { Queue, FiniteStateMachine } from '@blackglory/structures'
import { validateConcurrency } from '@utils/validate-concurrency'

export type Task<T> = () => PromiseLike<T>

export class TaskRunner {
  private fsm = new FiniteStateMachine(
    {
      running: {
        stop: 'stopped'
      }
    , stopped: {
        start: 'running'
      }
    }
  , 'stopped'
  )
  private queue = new Queue<[Task<unknown>, Deferred<any>]>()
  private pending: number = 0
  private debounceMicrotask = new DebounceMicrotask()

  constructor(private concurrency: number = Infinity) {}

  getConcurrency(): number {
    return this.concurrency
  }

  setConcurrency(concurrency: number): void {
    validateConcurrency('concurrency', concurrency)

    this.concurrency = concurrency
  }

  async add<T>(task: Task<T>): Promise<T> {
    const deferred = new Deferred<T>()
    this.queue.enqueue([task, deferred])
    if (this.fsm.matches('running')) {
      this.debounceMicrotask.queue(this.nextTick)
    }
    return await deferred
  }

  start(): void {
    this.fsm.send('start')

    this.debounceMicrotask.queue(this.nextTick)
  }

  stop(): void {
    this.fsm.send('stop')

    this.debounceMicrotask.cancel(this.nextTick)
  }

  clear(): void {
    this.queue.empty()
  }

  private nextTick = () => {
    while (
      this.queue.size > 0 &&
      this.pending < this.concurrency
    ) {
      const [task, deferred] = this.queue.dequeue()!
      this.run(task, deferred)
    }
  }

  private async run(task: Task<unknown>, deferred: Deferred<unknown>): Promise<void> {
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
