import { Signal } from './signal'
import { SignalGroup } from '@classes/signal-group'
import { go } from '@blackglory/go'
import once from 'lodash/once'
import { Awaitable } from 'justypes'

type Release = () => void

export class Semaphore {
  private locked: number = 0
  private readonly awaitings = new SignalGroup()

  constructor(private readonly count: number) {}

  acquire(): Promise<Release>
  acquire<T>(handler: () => Awaitable<T>): Promise<T>
  acquire(...args:
  | []
  | [handler: () => Awaitable<void>]
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
      this.awaitings.add(unlockSignal)
      await unlockSignal
      this.awaitings.remove(unlockSignal)
    }
    this.locked++
  }

  private unlock() {
    this.locked--
    this.awaitings.emitAll()
  }

  private isLocked(): boolean {
    return this.count - this.locked === 0
  }
}
