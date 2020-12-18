import { Signal } from '@classes/signal'
import { SignalGroup } from '@src/shared/signal-group'
import { isFunction } from '@blackglory/types'

type Release = () => void
export class Mutex {
  #isLocked = false
  #awaiting: SignalGroup = new SignalGroup()

  acquire(): Promise<Release>
  acquire(handler: () => void | Promise<void>): void
  acquire(handler?: () => void | Promise<void>): void | Promise<Release> {
    if (isFunction(handler)) {
      (async () => {
        await this.lock()
        await handler()
        this.unlock()
      })()
    } else {
      return new Promise(async resolve => {
        await this.lock()
        resolve(() => this.unlock())
      })
    }
  }

  private async lock() {
    while (this.#isLocked) {
      const unlockSignal = new Signal()
      this.#awaiting.add(unlockSignal)
      await unlockSignal
      this.#awaiting.remove(unlockSignal)
    }
    this.#isLocked = true
  }

  private unlock() {
    if (this.#isLocked) {
      this.#isLocked = false
      this.#awaiting.emitAll()
    }
  }
}
