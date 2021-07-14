import { Signal } from './signal'
import { SignalGroup } from '@classes/signal-group'
import { go } from '@blackglory/go'

type Release = () => void

export class Semaphore {
  #locked: number = 0
  readonly #count: number
  readonly #awaiting = new SignalGroup()

  constructor(count: number) {
    this.#count = count
  }

  acquire(): Promise<Release>
  acquire(handler: () => void | PromiseLike<void>): Promise<void>
  acquire(...args:
  | []
  | [handler: () => void | PromiseLike<void>]
  ) {
    if (args.length === 0) {
      return new Promise(async resolve => {
        await this.lock()
        resolve(oneShot(() => this.unlock()))
      })
    } else {
      const [handler] = args
      return go(async () => {
        await this.lock()
        await handler()
        this.unlock()
      })
    }
  }

  private async lock() {
    while (this.isLocked()) {
      const unlockSignal = new Signal()
      this.#awaiting.add(unlockSignal)
      await unlockSignal
      this.#awaiting.remove(unlockSignal)
    }
    this.#locked++
  }

  private unlock() {
    this.#locked--
    this.#awaiting.emitAll()
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
