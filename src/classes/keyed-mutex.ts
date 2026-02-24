import { Awaitable } from 'justypes'
import { once } from 'lodash-es'
import { Deferred } from '@classes/deferred.js'
import { UniqueQueue } from '@blackglory/structures'
import { go } from '@blackglory/go'

type Release = () => void

export class KeyedMutex<T, U> {
  protected lockedKeys: Set<U> = new Set()
  private keyToUnlockDeferredQueue: Map<U, UniqueQueue<Deferred<void>>> = new Map()

  constructor(protected createKey: (val: T) => U) {}

  acquire<U>(val: T, handler: () => Awaitable<U>): Promise<U>
  acquire(val: T): Promise<Release>
  async acquire<U>(val: T, handler?: () => Awaitable<U>) {
    const key = this.createKey(val)

    await this.lock(key)

    if (handler) {
      try {
        return await handler()
      } finally {
        this.unlock(key)
      }
    } else {
      return once(() => this.unlock(key))
    }
  }

  // 虽然是异步函数, 但在无锁情况下, 由于循环体内的异步代码没有执行, 函数实际上会同步返回.
  private async lock(key: U): Promise<void> {
    while (!this.tryLock(key)) await this.waitForUnlock(key)
  }

  private tryLock(key: U): boolean {
    if (this.lockedKeys.has(key)) {
      return false
    } else {
      this.lockedKeys.add(key)
      return true
    }
  }

  private async waitForUnlock(key: U): Promise<void> {
    const queue = go(() => {
      const queue = this.keyToUnlockDeferredQueue.get(key)
      if (queue) {
        return queue
      } else {
        const queue = new UniqueQueue<Deferred<void>>()
        this.keyToUnlockDeferredQueue.set(key, queue)
        return queue
      }
    })

    const unlockDeferred = new Deferred<void>()
    queue.enqueue(unlockDeferred)

    try {
      await unlockDeferred
    } finally {
      queue.remove(unlockDeferred)

      if (queue.size === 0) {
        this.keyToUnlockDeferredQueue.delete(key)
      }
    }
  }

  private unlock(key: U): void {
    this.lockedKeys.delete(key)

    const queue = this.keyToUnlockDeferredQueue.get(key)
    if (queue) {
      queue.dequeue()?.resolve()

      if (queue.size === 0) {
        this.keyToUnlockDeferredQueue.delete(key)
      }
    }
  }
}
