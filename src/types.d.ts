interface IChannel<T> {
  send(value: T): void
  receive(): AsyncIterable<T>
  close: () => void
}

interface IBlockingChannel<T> {
  send(value: T): Promise<void>
  receive(): AsyncIterable<T>
  close: () => void
}
