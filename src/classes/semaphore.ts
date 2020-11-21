import { Signal } from './signal'
import { isFunction } from '@blackglory/types'

type Release = () => void

export class Semaphore {
  #locked: number = 0
  readonly #count: number
  readonly #unlockSignal = new Signal()

  constructor(count: number) {
    this.#count = count
  }

  acquire(): Promise<Release>
  acquire(handler: () => void | Promise<void>): void
  acquire(handler?: () => void | Promise<void>): void | Promise<Release> {
    if (isFunction(handler)) {
      (async () => {
        if (this.isLocked()) await this.waitForUnlock()
        this.lock()
        await handler()
        this.unlock()
      })()
    } else {
      return new Promise(async resolve => {
        if (this.isLocked()) await this.waitForUnlock()
        this.lock()
        resolve(oneShot(() => this.unlock()))
      })
    }
  }

  private unlock() {
    this.#locked--
    this.#unlockSignal.emit()
  }

  private lock() {
    this.#locked++
    this.#unlockSignal.refresh()
  }

  private async waitForUnlock(): Promise<void> {
    while (this.isLocked()) {
      await this.#unlockSignal
    }
  }

  private isLocked(): boolean {
    return this.#count - this.#locked === 0
  }
}

function oneShot(fn: () => void) {
  let used = false
  return () => {
    if (!used) {
      used = true
      fn()
    }
  }
}
