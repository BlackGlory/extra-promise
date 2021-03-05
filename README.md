# extra-promise [![npm](https://img.shields.io/npm/v/extra-promise.svg?maxAge=86400)](https://www.npmjs.com/package/extra-promise) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/extra-promise/master/LICENSE)

Utilities for JavaScript Promise and AsyncFunction.

## Install

```sh
npm install --save extra-promise
# or
yarn add extra-promise
```

## API

### isPromise

```ts
function isPromise<T>(val: any): val is Promise<T>
```

Check if the `val` is a `Promise` instance.

### isPromiseLike

```ts
function isPromiseLike<T>(val: any): val is PromiseLike<T>
```

Check if the `val` has a `then` method.

### delay

```ts
function delay(timeout: number): Promise<void>
```

A simple wrapper for `setTimeout`.

### timeout

```ts
function timeout(ms: number): Promise<never>
```

It throws a `TimeoutError` after `ms` milliseconds.

```ts
try {
  result = await Promise.race([
    fetchData()
  , timeout(5000)
  ])
} catch (e) {
  if (e instanceof TimeoutError) ...
}
```

### timeoutSignal

```ts
function timeoutSignal(ms: number): AbortSignal
```

It will abort after `ms` milliseconds.

```ts
await fetch('http://example.com', { signal: timeoutSignal(5000) })
```

### pad

```ts
function pad<T>(ms: number, fn: () => T | PromiseLike<T>): Promise<T>
```

Run a function, but wait at least `ms` milliseconds before returning.

### retryUntil

```ts
function retryUntil<T, U = unknown>(
  fn: () => T | PromiseLike<T>
, until: (error: U) => boolean | PromiseLike<boolean>
): Promise<T>
```

If `fn` function throws an error, continue to retry until the return value of the `until` function is true.

### parallel

```ts
function parallel<T>(
  tasks: Iterable<() => T | PromiseLike<T>>
, concurrency: number = Infinity
): Promise<void>
```

Perform tasks in parallel.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### series

```ts
function series<T>(tasks: Iterable<() => T | PromiseLike<T>>): Promise<void>
```

Perform tasks in order.
Equivalent to `parallel(tasks, 1)`.

### waterfall

```ts
function waterfall<T>(
  tasks: Iterable<(result: unknown) => unknown | PromiseLike<unknown>>
): Promise<T | undefined>
```

Perform tasks in order, the return value of the previous task will become the parameter of the next task. If `tasks` is empty, return `Promise<undefined>`.

### each

```ts
function each(
  iterable: Iterable<T>
, fn: (element: T, i: number) => unknown | PromiseLike<unknown>
, concurrency: number = Infinity
): Promise<void>
```

The async `each` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### map

```ts
function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, concurrency: number = Infinity
): Promise<U[]>
```

The async `map` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### filter

```ts
function filter<T, U = T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => boolean | PromiseLike<boolean>
, concurrency: number = Infinity
): Promise<U[]>
```

The async `filter` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### promisify

```ts
function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: any[]) => unknown
): (...args: Args) => Promise<Result>
```

The well-known `promisify` function.

### callbackify

```ts
function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => PromiseLike<Result>
): (...args: Args) => void
```

The `callbackify` function, as opposed to `promisify`.

The return value:
* If `args.length = 0` then throw `InvalidArgumentsLengthError`.
* If the last element of args is not a function then throw `InvalidArugmentError`.
* If the error of it is a falsy value then wrap it into a `FalsyError`, the `reason` property is the real error.

### asyncify

```ts
function asyncify<T extends any[], U>(
  fn: (...args: T) => U | PromiseLike<U>
): (...args: Promisify<T>) => Promise<U>
```

Turn sync functions into async functions.

```ts
const a = 1
const b = Promise.resolve(2)

const add = (a: number, b: number) => a + b

// BAD
add(a, await b) // 3

// GOOD
const addAsync = asyncify(add) // (a: number | PromiseLike<number>, b: number | PromiseLike<number>) => Promise<number>
await addAsync(a, b) // Promise<3>
```

### cascadify

```ts
function cascadify<T extends object>(target: T): Cascadify<T>
```

Use the decorator `Cascadable` to mark the cascadable methods (the return value is `PromiseLike<this>`), transform the instance into a cascadify instance, and end with the non-cascadable member.

```ts
class Adder {
  value: number

  constructor(initialValue: number) {
    this.value = initialValue
  }

  get() {
    return this.value
  }

  async getAsync() {
    return this.value
  }

  @Cascadable
  async add(value: number) {
    this.value += value
    return this
  }
}

await cascadify(adder)
  .add(10)
  .get()

await cascadify(adder)
  .add(10)
  .getAsync()

await cascadify(adder)
  .add(10)
  .value
```

### Channel

```ts
class Channel<T> {
  send(value: T): Promise<void>
  receive(): AsyncIterable<T>
  close: () => void
}
```

Implement MPMC(multi-producer, multi-consumer) FIFO queue communication with `Promise` and `AsyncIterable`.

- `send`
  Send value to the channel, block until data is taken out by the consumer.
- `receive`
  Receive value from the channel.
- `close`
  Close the channel, no more values can be sent.

If the channel closed, `send` will throw `ChannelClosedError`.

```ts
const chan = new Channel<string>()
queueMicrotask(() => {
  await chan.send('hello')
  await chan.send('world')
  chan.close()
})
for await (const value of chan.receive()) {
  console.log(value)
}
```

### BufferedChannel

```ts
class BufferedChannel {
  send(value: T): Promise<void>
  receive(): AsyncIterable<T>
  close: () => void
}
```

Implement MPMC(multi-producer, multi-consumer) FIFO queue communication with `Promise` and `AsyncIterable`.
When the amount of data sent exceeds `bufferSize`, `send` will block until data in buffer is taken out by the consumer.

- `send`
  Send value to the channel.
  If the buffer is full, block.
- `receive`
  Receive value from the channel.
- `close`
  Close channel, no more values can be sent.

If the channel closed, `send` will throw `ChannelClosedError`.

```ts
const chan = new BufferedChannel<string>(1)

queueMicrotask(() => {
  await chan.send('hello')
  await chan.send('world')
  chan.close()
})

for await (const value of chan.receive()) {
  console.log(value)
}
```

### UnlimitedChannel

```ts
class UnlimitedChannel {
  send(value: T): void
  receive(): AsyncIterable<T>
  close: () => void
}
```

Implement MPMC(multi-producer, multi-consumer) FIFO queue communication with `Promise` and `AsyncIterable`.

`UnlimitedChannel` return a tuple includes three channel functions:
- `send`
  Send value to the channel.
  There is no size limit on the buffer, all sending will return immediately.
- `receive`
  Receive value from the channel.
- `close`
  close the channel, no more values can be sent.

If the channel closed, `send` will throw `ChannelClosedError`.

```ts
const chan = new UnlimitedChannel<string>()

queueMicrotask(() => {
  chan.send('hello')
  chan.send('world')
  chan.close()
})

for await (const value of chan.receive()) {
  console.log(value)
}
```

### Deferred

```ts
class Deferred<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  resolve(value: T): void
  reject(reason: unknown): void
}
```

`Deferred` is a `Promise` that separates `resolve()` and `reject()` from the constructor.

### LazyPromise

```ts
class LazyPromise<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void)
}
```

`LazyPromise` constructor is the same as `Promise`.

The difference with `Promise` is that `LazyPromise` only performs `executor` after `then` method is called.

### Signal

```ts
class Signal implements PromiseLike<void> {
  then: PromiseLike<void>['then']

  emit(): void
  discard(): void
}
```

The `emit()` make the internal Promise resolve.

The `discard()` make the internal Promise reject `SignalDiscarded`.

### SignalGroup

```ts
class SignalGroup {
  add(signal: Signal): void
  remove(signal: Signal): void

  emitAll(): void
  discardAll(): void
}
```

### Semaphore

```ts
type Release = () => void

class Semaphore {
  constructor(count: number)

  acquire(): Promise<Release>
  acquire(handler: () => void | Promise<void>): void
}
```

### Mutex

```ts
type Release = () => void

class Mutex extends Semaphore {
  acquire(): Promise<Release>
  acquire(handler: () => void | Promise<void>): void
}
```

### DebounceMicrotask

```ts
class DebounceMicrotask {
  queue(fn: () => void): void
  cancel(fn: () => void): boolean
}
```

`queue` can create microtasks,
if the microtask is not executed, multiple calls will only queue it once.

`cancel` can cancel microtasks before it is executed.

### TaskRunner

```ts
type Task<T> = () => PromiseLike<T>

class TaskRunner<T> extends EventEmitter {
  constructor(concurrency: number = Infinity)

  setConcurrency(concurrency: number): void
  push(...tasks: Task<T>[]): void
  clear(): void

  pause(): void
  resume(): void
}
```

A task runner, it will automatically execute tasks in FIFO order.

TaskRunner provides theses events:
- `started`: It will be triggered after a task is started, provide the parameter `task`.
- `resolved`: It will be triggered after a task is resolved, provide the paramter `task` and `result`.
- `rejected`: It will be triggered after a task is rejected, provide the paramters `task` and `reason`. At the same time, TaskRunner will pause.
