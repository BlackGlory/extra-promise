type Callback = () => void

const queued = new WeakSet<Callback>()

export function debounceMicrotask(callback: Callback): void {
  if (!queued.has(callback)) {
    queued.add(callback)
    queueMicrotask(() => {
      if (queued.has(callback)) {
        callback()
        queued.delete(callback)
      }
    })
  }
}

export function cancelMicrotask(callback: Callback): boolean {
  if (queued.has(callback)) return queued.delete(callback)
  return false
}
