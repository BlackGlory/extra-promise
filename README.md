# extra-promise
Utilities for JavaScript `Promise` and async functions.

## Install
```sh
npm install --save extra-promise
# or
yarn add extra-promise
```

## API
### functions
#### delay
```ts
function delay(timeout: number): Promise<void>
```

A simple wrapper for `setTimeout`.

#### timeout
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

#### pad
```ts
function pad<T>(ms: number, fn: () => T | PromiseLike<T>): Promise<T>
```

Run a function, but wait at least `ms` milliseconds before returning.

#### parallel
```ts
function parallel(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
, concurrency: number = Infinity
): Promise<void>
```

Perform tasks in parallel.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### parallelAsync
```ts
function parallelAsync(
  tasks: AsyncIterable<() => unknown | PromiseLike<unknown>>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<void>
```

Same as `parallel`, but `tasks` is an `AsyncIterable`.

#### series
```ts
function series(
  tasks: Iterable<() => unknown | PromiseLike<unknown>>
       | AsyncIterable<() => unknown | PromiseLike<unknown>>
): Promise<void>
```

Perform tasks in order.
Equivalent to `parallel(tasks, 1)`.

#### waterfall
```ts
function waterfall<T>(
  tasks: Iterable<(result: unknown) => unknown | PromiseLike<unknown>>
       | AsyncIterable<(result: unknown) => unknown | PromiseLike<unknown>>
): Promise<T | undefined>
```

Perform tasks in order, the return value of the previous task will become the parameter of the next task. If `tasks` is empty, return `Promise<undefined>`.

#### each
```ts
function each(
  iterable: Iterable<T>
, fn: (element: T, i: number) => unknown | PromiseLike<unknown>
, concurrency: number = Infinity
): Promise<void>
```

The async `each` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### eachAsync
```ts
function eachAsync<T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => unknown | PromiseLike<unknown>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<void>
```

Same as `each`, but `iterable` is an `AsyncIterable`.

#### map
```ts
function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, concurrency: number = Infinity
): Promise<U[]>
```

The async `map` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### mapAsync
```ts
export function mapAsync<T, U>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => U | PromiseLike<U>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<U[]>
```

Same as `map`, but `iterable` is an `AsyncIterable`.

#### filter
```ts
function filter<T, U = T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => boolean | PromiseLike<boolean>
, concurrency: number = Infinity
): Promise<U[]>
```

The async `filter` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### filterAsync
```ts
function filterAsync<T, U = T>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => boolean | PromiseLike<boolean>
, /**
   * concurrency must be finite number
   */
  concurrency: number
): Promise<U[]>
```

Same as `filter`, but `iterable` is an `AsyncIterable`.

#### all
```ts
function all<T extends { [key: string]: PromiseLike<unknown> }>(
  obj: T
): Promise<{ [Key in keyof T]: UnpackedPromiseLike<T[Key]> }>
```

It is similar to `Promise.all`, but the first parameter is an object.

Example:
```ts
const { task1, task2 } = await all({
  task1: invokeTask1()
, task2: invokeTask2()
})
```

#### promisify
```ts
type Callback<T> = (err: any, result?: T) => void

function promisify<Result, Args extends any[] = unknown[]>(
  fn: (...args: [...args: Args, callback?: Callback<Result>]) => unknown
): (...args: Args) => Promise<Result>
```

The well-known `promisify` function.

#### callbackify
```ts
type Callback<T> = (err: any, result?: T) => void

function callbackify<Result, Args extends any[] = unknown[]>(
  fn: (...args: Args) => Awaitable<Result>
): (...args: [...args: Args, callback: Callback<Result>]) => void
```

The `callbackify` function, as opposed to `promisify`.

#### asyncify
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

#### toExtraPromise
```ts
function toExtraPromise<T>(promise: PromiseLike<T>): ExtraPromise<T>
```

#### spawn
```ts
function spawn(num: number, task: (id: number) => Promise<void>): Promise<void>
```

A sugar for running the same task in parallel.

The parameter `id` is from `1` to `num`.

#### queueConcurrency
```ts
function queueConcurrency<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T>
```

Limit the number of concurrency, calls that exceed the number of concurrency will be delayed in order.

#### throttleConcurrency
```ts
function throttleConcurrency<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T> | undefined
```

Limit the number of concurrency, calls that exceed the number of concurrency will not occur and return `undefined`.

#### reusePendingPromise
```ts
type VerboseResult<T> = [value: T, isReuse: boolean]

interface IReusePendingPromiseOptions {
  verbose?: true
}

function reusePendingPromise<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromiseOptions & { verbose: true }
): (...args: Args) => Promise<VerboseResult<T>>
function reusePendingPromise<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromiseOptions & { verbose: false }
): (...args: Args) => Promise<T>
function reusePendingPromise<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: Omit<IReusePendingPromiseOptions, 'verbose'>
): (...args: Args) => Promise<T>
function reusePendingPromise<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T>
```

Returns a function that will return the same `Promise` for calls with the same parameters if the `Promise` is pending.

### Classes
#### ExtraPromise
```ts
enum ExtraPromiseState {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

class ExtraPromise<T> extends Promise<T> {
  get pending(): boolean
  get fulfilled(): boolean
  get rejected(): boolean
  get state(): ExtraPromiseState

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void)
}
```

A subclass of `Promise`.

`ExtraPromise` has 3 readonly properties: `pending`, `fulfilled`, and `rejected`.
So the state of the `Promise` can be known without calling the `then` method.

#### Channel
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

#### BufferedChannel
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

#### UnlimitedChannel
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

#### Deferred
```ts
class Deferred<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  resolve(value: T): void
  reject(reason: unknown): void
}
```

`Deferred` is a `Promise` that separates `resolve()` and `reject()` from the constructor.

#### MutableDeferred
```ts
class MutableDeferred<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  resolve(value: T): void
  reject(reason: unknown): void
}
```

`MutableDeferred` is similar to `Deferred`,
but its `resolve()` and `reject()` can be called multiple times to change the value.

```ts
const deferred = new MutableDeferred()
deferred.resolve(1)
deferred.resolve(2)

await deferred // resolved(2)
```

#### ReusableDeferred
```ts
class ReusableDeferred<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  resolve(value: T): void
  reject(reason: unknown): void
}
```

`ReusableDeferred` is similar to `MutableDeferred`,
but its internal `Deferred` will be overwritten with a new pending `Deferred` after each call.

```ts
const deferred = new ReusableDeferred()
deferred.resolve(1)
queueMicrotask(() => deferred.resolve(2))

await deferred // pending, resolved(2)
```

#### LazyPromise
```ts
class LazyPromise<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void)
}
```

`LazyPromise` constructor is the same as `Promise`.

The difference with `Promise` is that `LazyPromise` only performs `executor` after `then` method is called.

#### Signal
```ts
class Signal implements PromiseLike<void> {
  then: PromiseLike<void>['then']

  emit(): void
  discard(): void
}
```

A one-time signal.

The `emit()` make the internal Promise resolve.

The `discard()` make the internal Promise reject `SignalDiscarded`.

#### SignalGroup
```ts
class SignalGroup {
  add(signal: Signal): void
  remove(signal: Signal): void

  emitAll(): void
  discardAll(): void
}
```

#### Semaphore
```ts
type Release = () => void

class Semaphore {
  constructor(count: number)

  acquire(): Promise<Release>
  acquire<T>(handler: () => T | PromiseLike<T>): Promise<T>
}
```

#### Mutex
```ts
type Release = () => void

class Mutex extends Semaphore {
  acquire(): Promise<Release>
  acquire<T>(handler: () => T | PromiseLike<T>): Promise<T>
}
```

#### DebounceMicrotask
```ts
class DebounceMicrotask {
  queue(fn: () => void): void
  cancel(fn: () => void): boolean
}
```

`queue` can create microtasks,
if the microtask is not executed, multiple calls will only queue it once.

`cancel` can cancel microtasks before it is executed.

#### TaskRunner
```ts
type Task<T> = () => PromiseLike<T>

class TaskRunner {
  constructor(concurrency: number = Infinity)

  getConcurrency(): number
  setConcurrency(concurrency: number): void

  add(task: Task<T>): Promise<T>
  clear(): void

  start(): void
  stop(): void
}
```

A task runner, it will execute tasks in FIFO order.
