import { setImmediate } from 'extra-timers'

export class DebounceMacrotask {
  private registry = new Set<() => void>()
  private cancelMacrotask?: () => void

  tick = () => {
    const registry = this.registry

    delete this.cancelMacrotask
    this.registry = new Set()

    for (const fn of registry) {
      fn()
    }
  }

  queue(fn: () => void): void {
    this.registry.add(fn)

    if (!this.cancelMacrotask) {
      this.cancelMacrotask = setImmediate(this.tick)
    }
  }

  cancel(fn: () => void): void {
    this.registry.delete(fn)
  }
}
