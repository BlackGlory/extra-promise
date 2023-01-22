import { Deferred } from './deferred.js'
import { DeferredGroup } from '@classes/deferred-group.js'
import { go } from '@blackglory/go'
import { once } from 'lodash-es'
import { Awaitable } from 'justypes'

type Release = () => void

export class Semaphore {
  private locked: number = 0
  private readonly awaitings = new DeferredGroup()

  constructor(private readonly count: number) {}

  acquire(): Promise<Release>
  acquire<T>(handler: () => Awaitable<T>): Promise<T>
  acquire(...args:
  | []
  | [handler: () => Awaitable<void>]
  ) {
    if (args.length === 0) {
      return new Promise(async resolve => {
        // 此处的`tryLock`和`waitForUnlock`组合不能被封装成一个`lock`函数,
        // 因为`await lock()`会导致引擎等待下一个microtask, 造成无锁情况下任务被延迟执行.
        while (!this.tryLock()) {
          await this.waitForUnlock()
        }

        resolve(once(() => this.unlock()))
      })
    } else {
      const [handler] = args
      return go(async () => {
        // 此处的`tryLock`和`waitForUnlock`组合不能被封装成一个`lock`函数,
        // 因为`await lock()`会导致引擎等待下一个microtask, 造成在无锁情况下任务被延迟执行.
        while (!this.tryLock()) {
          await this.waitForUnlock()
        }

        try {
          const result = await handler()
          return result
        } finally {
          this.unlock()
        }
      })
    }
  }

  private tryLock(): boolean {
    if (this.isLocked()) {
      return false
    } else {
      this.locked++
      return true
    }
  }

  private async waitForUnlock(): Promise<void> {
    const unlockDeferred = new Deferred()
    this.awaitings.add(unlockDeferred)
    await unlockDeferred
    this.awaitings.remove(unlockDeferred)
  }

  private unlock(): void {
    this.locked--
    this.awaitings.resolve(undefined)
  }

  private isLocked(): boolean {
    return this.locked === this.count
  }
}
