import { Signal } from '@classes/signal'
import { SignalGroup } from './signal-group'

export class Mutex {
  #isLocked = false
  #awaiting: SignalGroup = new SignalGroup()

  async lock(): Promise<void> {
    while (this.#isLocked) {
      const unlockSignal = new Signal()
      this.#awaiting.add(unlockSignal)
      await unlockSignal
      this.#awaiting.remove(unlockSignal)
    }
    this.#isLocked = true
  }

  unlock() {
    if (this.#isLocked) {
      this.#isLocked = false
      this.#awaiting.emitAll()
    }
  }
}
