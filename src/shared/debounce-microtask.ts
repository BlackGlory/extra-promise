const registry = new WeakSet<() => void>()

export function debounceMicrotask(fn: () => void): void {
  if (registry.has(fn)) return

  registry.add(fn)
  queueMicrotask(() => {
    if (notCancel(fn)) {
      try {
        fn()
      } finally {
        registry.delete(fn)
      }
    }
  })
}

export function cancelMicrotask(fn: () => void): boolean {
  if (notCancel(fn)) {
    return registry.delete(fn)
  } else {
    return false
  }
}

function notCancel(fn: () => void) {
  return registry.has(fn)
}
