export interface INonBlockingChannel<T> {
  send(value: T): void
  receive(): AsyncIterable<T>
  close: () => void
}

export interface IBlockingChannel<T> {
  send(value: T): Promise<void>
  receive(): AsyncIterable<T>
  close: () => void
}

export interface IDeferred<T> {
  resolve(value: T): void
  reject(reason: unknown): void
}
