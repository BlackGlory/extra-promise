export class DebounceMicrotask {
  #registry = new WeakSet<() => void>()

  queue(fn: () => void): void {
    if (this.#registry.has(fn)) return

    this.#registry.add(fn)
    queueMicrotask(() => {
      if (this.#registry.has(fn)) {
        try {
          fn()
        } finally {
          this.#registry.delete(fn)
        }
      }
    })
  }

  cancel(fn: () => void): void {
    this.#registry.delete(fn)
  }
}
