import { Awaitable } from 'justypes'
import { once } from 'lodash-es'
import { Deferred } from '@classes/deferred.js'

type Release = () => void

export class KeyedMutex<T, U> {
  protected keyToUnlockDeferred: Map<U, Deferred<void>> = new Map()

  constructor(protected createKey: (val: T) => U) {}

  acquire<U>(val: T, handler: () => Awaitable<U>): Promise<U>
  acquire(val: T): Promise<Release>
  async acquire<U>(val: T, handler?: () => Awaitable<U>) {
    const key = this.createKey(val)
    const release = await this.lock(key)

    if (handler) {
      try {
        return await handler()
      } finally {
        release()
      }
    } else {
      return once(release)
    }
  }

  // 虽然是异步函数, 但在无锁情况下, 由于循环体内的异步代码没有执行, 函数实际上会同步返回.
  private async lock(key: U): Promise<Release> {
    let releaseOrUnlockDeferred: Release | Deferred<void>
    while (
      releaseOrUnlockDeferred = this.tryLock(key)
    , releaseOrUnlockDeferred instanceof Deferred
    ) {
      const unlockDeferred = releaseOrUnlockDeferred
      await unlockDeferred
    }
    const release = releaseOrUnlockDeferred
    return release
  }

  private tryLock(key: U): Release | Deferred<void> {
    const unlockDeferred = this.keyToUnlockDeferred.get(key)
    if (unlockDeferred) {
      return unlockDeferred
    } else {
      const unlockDeferred = new Deferred<void>()

      this.keyToUnlockDeferred.set(key, unlockDeferred)

      return () => {
        this.keyToUnlockDeferred.delete(key)
        unlockDeferred.resolve()
      }
    }
  }
}
