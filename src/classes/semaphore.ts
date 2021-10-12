import { Signal } from './signal'
import { SignalGroup } from '@classes/signal-group'
import { go } from '@blackglory/go'
import once from 'lodash.once'

type Release = () => void

export class Semaphore {
  #locked: number = 0
  readonly #count: number
  readonly #awaiting = new SignalGroup()

  constructor(count: number) {
    this.#count = count
  }

  acquire(): Promise<Release>
  acquire<T>(handler: () => T | PromiseLike<T>): Promise<T>
  acquire(...args:
  | []
  | [handler: () => void | PromiseLike<void>]
  ) {
    if (args.length === 0) {
      return new Promise(async resolve => {
        await this.lock()
        resolve(once(() => this.unlock()))
      })
    } else {
      const [handler] = args
      return go(async () => {
        await this.lock()
        try {
          const result = await handler()
          return result
        } finally {
          this.unlock()
        }
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
