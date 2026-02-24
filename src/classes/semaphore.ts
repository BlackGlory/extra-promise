import { Deferred } from '@classes/deferred.js'
import { UniqueQueue } from '@blackglory/structures'
import { once } from 'lodash-es'
import { Awaitable } from 'justypes'

type Release = () => void

export class Semaphore {
  protected users: number = 0
  private readonly unlockDeferredQueue: UniqueQueue<Deferred<void>> = new UniqueQueue()

  constructor(private readonly permits: number) {}

  acquire<T>(handler: () => Awaitable<T>): Promise<T>
  acquire(): Promise<Release>
  async acquire(handler?: () => Awaitable<void>) {
    await this.lock()

    if (handler) {
      try {
        return await handler()
      } finally {
        this.unlock()
      }
    } else {
      return once(() => this.unlock())
    }
  }

  // 虽然是异步函数, 但在无锁情况下, 由于循环体内的异步代码没有执行, 函数实际上会同步返回.
  private async lock(): Promise<void> {
    while (!this.tryLock()) await this.waitForUnlock()
  }

  private tryLock(): boolean {
    if (this.isLocked()) {
      return false
    } else {
      this.users++
      return true
    }
  }

  private async waitForUnlock(): Promise<void> {
    const unlockDeferred = new Deferred<void>()

    this.unlockDeferredQueue.enqueue(unlockDeferred)
    try {
      await unlockDeferred
    } finally {
      this.unlockDeferredQueue.remove(unlockDeferred)
    }
  }

  private unlock(): void {
    this.users--

    const unlockDeferred = this.unlockDeferredQueue.dequeue()
    unlockDeferred?.resolve()
  }

  protected isLocked(): boolean {
    return this.users === this.permits
  }
}
