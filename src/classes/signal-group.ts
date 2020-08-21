import { Signal } from './signal'

export class SignalGroup {
  #group = new Set<Signal>()

  add(signal: Signal) {
    this.#group.add(signal)
  }

  emitAll() {
    for (const signal of this.#group) {
      signal.emit()
    }
  }

  discardAndRefreshAll() {
    for (const signal of this.#group) {
      signal.discard()
      signal.refresh()
    }
  }
}
