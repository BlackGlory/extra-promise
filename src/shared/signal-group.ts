import { Signal } from '@classes/signal'

export class SignalGroup {
  #group = new Set<Signal>()

  add(signal: Signal) {
    this.#group.add(signal)
  }

  remove(signal: Signal) {
    this.#group.delete(signal)
  }

  emitAll() {
    for (const signal of this.#group) {
      signal.emit()
    }
  }

  discardAll() {
    for (const signal of this.#group) {
      signal.discard()
    }
  }
}
