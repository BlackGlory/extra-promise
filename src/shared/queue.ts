import { CustomError } from '@blackglory/errors'

export class Queue<T> {
  #items: T[] = []

  enqueue(...items: T[]): void {
    this.#items.push(...items)
  }

  dequeue(): T {
    if (this.size === 0) throw new EmptyQueueError()
    return this.#items.shift()!
  }

  get size(): number {
    return this.#items.length
  }
}

export class EmptyQueueError extends CustomError {
  constructor() {
    super('Queue is empty.')
  }
}
