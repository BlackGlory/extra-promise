import { ReusableDeferred } from '@classes/reusable-deferred.js'
import { go } from '@blackglory/go'
import { once } from 'lodash-es'
import { Awaitable } from 'justypes'

type Release = () => void

export class Semaphore {
  private locked: number = 0
  private readonly unlockDeferred: ReusableDeferred<void> = new ReusableDeferred()

  constructor(private readonly count: number) {}

  acquire<T>(handler: () => Awaitable<T>): Promise<T>
  acquire(): Promise<Release>
  acquire(handler?: () => Awaitable<void>) {
    if (handler) {
      return go(async () => {
        // 此处的`tryLock`和`waitForUnlock`组合不能被组合封装成一个`lock`函数,
        // 因为最外侧的`await lock()`会导致在无锁情况下取得锁时, 任务延迟执行.
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
    } else {
      return new Promise(async resolve => {
        while (!this.tryLock()) {
          await this.waitForUnlock()
        }

        resolve(once(() => this.unlock()))
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
    await this.unlockDeferred
  }

  private unlock(): void {
    this.locked--
    this.unlockDeferred.resolve()
  }

  private isLocked(): boolean {
    return this.locked === this.count
  }
}
