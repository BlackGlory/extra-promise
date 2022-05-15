export class DebounceMicrotask {
  private registry = new WeakSet<() => void>()

  queue(fn: () => void): void {
    if (this.registry.has(fn)) return

    this.registry.add(fn)
    queueMicrotask(() => {
      if (this.registry.has(fn)) {
        // DebounceMicrotask的目的仅仅是避免多次调用queueMicrotaskh函数,
        // 因此无论fn是同步函数还是异步函数都不会造成影响.
        try {
          fn()
        } finally {
          this.registry.delete(fn)
        }
      }
    })
  }

  cancel(fn: () => void): void {
    this.registry.delete(fn)
  }
}
