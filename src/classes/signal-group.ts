import { Signal } from './signal'

export class SignalGroup {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _group = new Set<Signal>()

  add(signal: Signal) {
    this._group.add(signal)
  }

  emitAll() {
    for (const signal of this._group) {
      signal.emit()
    }
  }

  discardAndRefreshAll() {
    for (const signal of this._group) {
      signal.discard()
      signal.refresh()
    }
  }
}
