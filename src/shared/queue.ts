export class Queue<T> {
  // fuck tsc https://github.com/microsoft/TypeScript/issues/36841
  private _items: T[] = []

  enqueue(...items: T[]): void {
    this._items.push(...items)
  }

  dequeue(): T {
    if (this.size === 0) throw new EmptyQueueError()
    return this._items.shift()!
  }

  get size(): number {
    return this._items.length
  }
}

export class EmptyQueueError extends Error {
  name = this.constructor.name

  constructor() {
    super('Queue is empty.')
  }
}
