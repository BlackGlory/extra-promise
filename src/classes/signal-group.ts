import { Signal } from '@classes/signal'

export class SignalGroup {
  private group = new Set<Signal>()

  add(signal: Signal): void {
    this.group.add(signal)
  }

  remove(signal: Signal): void {
    this.group.delete(signal)
  }

  emitAll(): void {
    for (const signal of this.group) {
      signal.emit()
    }
  }

  discardAll(): void {
    for (const signal of this.group) {
      signal.discard()
    }
  }
}
