export class DebounceMicrotask {
  private registry = new Set<() => void>()
  private queued = false

  tick = () => {
    const registry = this.registry

    this.queued = false
    this.registry = new Set()

    for (const fn of registry) {
      fn()
    }
  }

  queue(fn: () => void): void {
    this.registry.add(fn)

    if (!this.queued) {
      this.queued = true

      queueMicrotask(this.tick)
    }
  }

  cancel(fn: () => void): void {
    this.registry.delete(fn)
  }
}
