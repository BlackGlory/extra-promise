export class Queue<T> {
  #items: T[] = []

  enqueue(...items: T[]) {
    this.#items.push(...items)
  }

  dequeue(): T {
    if (this.size === 0) throw new Error('Queue is empty.')
    return this.#items.shift()!
  }

  get size() {
    return this.#items.length
  }
}
