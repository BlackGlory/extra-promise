export class DebounceMicrotask {
  private registry = new Set<() => void>()
  private queued = false

  tick = () => {
    for (const fn of this.registry) {
      fn()
    }

    this.registry = new Set()
    this.queued = false
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
