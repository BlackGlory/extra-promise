import { Signal } from './signal'

export class SignalGroup {
  #group = new Set<Signal>()

  add(signal: Signal) {
    this.#group.add(signal)
  }

  emit() {
    for (const signal of this.#group) {
      signal.emit()
    }
  }

  refresh() {
    for (const signal of this.#group) {
      signal.refresh()
    }
  }
}
