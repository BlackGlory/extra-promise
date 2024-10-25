# extra-promise
Utilities for JavaScript `Promise` and async functions.

## Install
```sh
npm install --save extra-promise
# or
yarn add extra-promise
```

## API
```ts
interface INonBlockingChannel<T> {
  send(value: T): void
  receive(): AsyncIterable<T>
  close: () => void
}

interface IBlockingChannel<T> {
  send(value: T): Promise<void>
  receive(): AsyncIterable<T>
  close: () => void
}

interface IDeferred<T> {
  resolve(value: T): void
  reject(reason: unknown): void
}
```

### functions
#### isPromise
```ts
function isPromise<T>(val: unknown): val is Promise<T>
function isntPromise<T>(val: T): val is Exclude<T, Promise<unknown>>
```

#### isPromiseLike
```ts
function isPromiseLike<T>(val: unknown): val is PromiseLike<T>
function isntPromiseLike<T>(val: T): val is Exclude<T, PromiseLike<unknown>>
```

#### delay
```ts
function delay(timeout: number, signal?: AbortSignal): Promise<void>
```

A simple wrapper for `setTimeout`.

#### timeout
```ts
function timeout(ms: number, signal?: AbortSignal): Promise<never>
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
function pad<T>(ms: number, fn: () => Awaitable<T>): Promise<T>
```

Run a function, but wait at least `ms` milliseconds before returning.

#### parallel
```ts
function parallel(
  tasks: Iterable<() => Awaitable<unknown>>
, concurrency: number = Infinity
): Promise<void>
```

Perform tasks in parallel.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### parallelAsync
```ts
function parallelAsync(
  tasks: AsyncIterable<() => Awaitable<unknown>>
, concurrency: number // concurrency must be finite number
): Promise<void>
```

Same as `parallel`, but `tasks` is an `AsyncIterable`.

#### series
```ts
function series(
  tasks: Iterable<() => Awaitable<unknown>>
       | AsyncIterable<() => Awaitable<unknown>>
): Promise<void>
```

Perform tasks in order.
Equivalent to `parallel(tasks, 1)`.

#### waterfall
```ts
function waterfall<T>(
  tasks: Iterable<(result: unknown) => Awatiable<unknown>>
       | AsyncIterable<(result: unknown) => Awaitable<unknown>>
): Promise<T | undefined>
```

Perform tasks in order, the return value of the previous task will become the parameter of the next task. If `tasks` is empty, return `Promise<undefined>`.

#### each
```ts
function each(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<unknown>
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
, fn: (element: T, i: number) => Awaitable<unknown>
, concurrency: number // concurrency must be finite number
): Promise<void>
```

Same as `each`, but `iterable` is an `AsyncIterable`.

#### map
```ts
function map<T, U>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<U>
, concurrency: number = Infinity
): Promise<U[]>
```

The async `map` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `Error`.

#### mapAsync
```ts
function mapAsync<T, U>(
  iterable: AsyncIterable<T>
, fn: (element: T, i: number) => Awaitable<U>
, concurrency: number // concurrency must be finite number
): Promise<U[]>
```

Same as `map`, but `iterable` is an `AsyncIterable`.

#### filter
```ts
function filter<T, U = T>(
  iterable: Iterable<T>
, fn: (element: T, i: number) => Awaitable<boolean>
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
, fn: (element: T, i: number) => Awaitable<boolean>
, concurrency: number // concurrency must be finite number
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
function asyncify<Args extends any[], Result, This = unknown>(
  fn: (this: This, ...args: Args) => Awaitable<Result>
): (this: This, ...args: Promisify<Args>) => Promise<Result>
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

It can also be used to eliminate the call stack:
```ts
// OLD
function count(n: number, i: number = 0): number {
  if (i < n) return count(n, i + 1)
  return i
}

count(10000) // RangeError: Maximum call stack size exceeded

// NEW
const countAsync = asyncify((n: number, i: number = 0): Awaitable<number> => {
  if (i < n) return countAsync(n, i + 1)
  return i
})

await countAsync(10000) // 10000
```

#### spawn
```ts
function spawn<T>(
  num: number
, create: (id: number) => Awaitable<T>
): Promise<T[]>
```

A sugar for create multiple values in parallel.

The parameter `id` is from `1` to `num`.

#### limitConcurrencyByQueue
```ts
function limitConcurrencyByQueue<T, Args extends any[]>(
  concurrency: number
, fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T>
```

Limit the number of concurrency, calls that exceed the number of concurrency will be delayed in order.

#### reusePendingPromises
```ts
type VerboseResult<T> = [value: T, isReuse: boolean]

interface IReusePendingPromisesOptions<Args> {
  createKey?: (args: Args) => unknown
  verbose?: true
}

function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromisesOptions<Args> & { verbose: true }
): (...args: Args) => Promise<VerboseResult<T>>
function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: IReusePendingPromisesOptions<Args> & { verbose: false }
): (...args: Args) => Promise<T>
function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
, options: Omit<IReusePendingPromisesOptions<Args>, 'verbose'>
): (...args: Args) => Promise<T>
function reusePendingPromises<T, Args extends any[]>(
  fn: (...args: Args) => PromiseLike<T>
): (...args: Args) => Promise<T>
```

Returns a function that will return the same `Promise` for calls with the same parameters if the `Promise` is pending.

It generates cache keys based on the `options.createKey` function,
The default value of `options.createKey` is a stable `JSON.stringify` implementation.

### Classes
#### StatefulPromise
```ts
enum StatefulPromiseState {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

class StatefulPromise<T> extends Promise<T> {
  static from<T>(promise: PromiseLike<T>): StatefulPromise<T>

  get state(): StatefulPromiseState

  constructor(
    executor: (
      resolve: (value: T) => void
    , reject: (reason: any) => void
    ) => void
  )

  isPending(): boolean
  isFulfilled(): boolean
  isRejected(): boolean
}
```

A subclass of `Promise` used for testing, helps you understand the state of `Promise`.

#### Channel
```ts
class Channel<T> implements IBlockingChannel<T>
```

Implement MPMC(multi-producer, multi-consumer) FIFO queue communication with `Promise` and `AsyncIterable`.

- `send`
  Send value to the channel, block until data is taken out by the consumer.
- `receive`
  Receive value from the channel.
- `close`
  Close the channel.

If the channel closed, `send` and `receive` will throw `ChannelClosedError`.
`AsyncIterator` that have already been created do not throw `ChannelClosedError`,
but return `{ done: true }`.

```ts
const chan = new Channel<string>()
queueMicrotask(() => {
  await chan.send('hello')
  await chan.send('world')
})
for await (const value of chan.receive()) {
  console.log(value)
}
```

#### BufferedChannel
```ts
class BufferedChannel<T> implements IBlockingChannel<T> {
  constructor(bufferSize: number)
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
  Close the channel.

If the channel closed, `send` and `receive` will throw `ChannelClosedError`.
`AsyncIterator` that have already been created do not throw `ChannelClosedError`,
but return `{ done: true }`.

```ts
const chan = new BufferedChannel<string>(1)

queueMicrotask(() => {
  await chan.send('hello')
  await chan.send('world')
})

for await (const value of chan.receive()) {
  console.log(value)
}
```

#### UnlimitedChannel
```ts
class UnlimitedChannel<T> implements INonBlockingChannel<T>
```

Implement MPMC(multi-producer, multi-consumer) FIFO queue communication with `Promise` and `AsyncIterable`.

`UnlimitedChannel` return a tuple includes three channel functions:
- `send`
  Send value to the channel.
  There is no size limit on the buffer, all sending will return immediately.
- `receive`
  Receive value from the channel.
- `close`
  Close the channel.

If the channel closed, `send` and `receive` will throw `ChannelClosedError`.
`AsyncIterator` that have already been created do not throw `ChannelClosedError`,
but return `{ done: true }`.

```ts
const chan = new UnlimitedChannel<string>()

queueMicrotask(() => {
  chan.send('hello')
  chan.send('world')
})

for await (const value of chan.receive()) {
  console.log(value)
}
```

#### Deferred
```ts
class Deferred<T> implements PromiseLike<T>, IDeferred<T>
```

`Deferred` is a `Promise` that separates `resolve()` and `reject()` from the constructor.

#### MutableDeferred
```ts
class MutableDeferred<T> implements PromiseLike<T>, IDefrred<T>
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
class ReusableDeferred<T> implements PromiseLike<T>, IDeferred<T>
```

`ReusableDeferred` is similar to `MutableDeferred`,
but its internal `Deferred` will be overwritten with a new pending `Deferred` after each call.

```ts
const deferred = new ReusableDeferred()
deferred.resolve(1)
queueMicrotask(() => deferred.resolve(2))

await deferred // pending, resolved(2)
```

#### DeferredGroup
```ts
class DeferredGroup<T> implements IDeferred<T> {
  add(deferred: IDeferred<T>): void
  remove(deferred: IDeferred<T>): void
  clear(): void
}
```

#### LazyPromise
```ts
class LazyPromise<T> implements PromiseLike<T> {
  then: PromiseLike<T>['then']

  constructor(
    executor: (resolve: (value: T) => void
  , reject: (reason: any) => void) => void
  )
}
```

`LazyPromise` constructor is the same as `Promise`.

The difference with `Promise` is that `LazyPromise` only performs `executor` after `then` method is called.

#### Semaphore
```ts
type Release = () => void

class Semaphore {
  constructor(count: number)

  acquire(): Promise<Release>
  acquire<T>(handler: () => Awaitable<T>): Promise<T>
}
```

#### Mutex
```ts
type Release = () => void

class Mutex extends Semaphore {
  acquire(): Promise<Release>
  acquire<T>(handler: () => Awaitable<T>): Promise<T>
}
```

#### DebounceMicrotask
```ts
class DebounceMicrotask {
  queue(fn: () => void): void
  cancel(fn: () => void): boolean
}
```

`queue` can create a microtask,
if the microtask is not executed, multiple calls will only queue it once.

`cancel` can cancel a microtask before it is executed.

#### DebounceMacrotask
```ts
class DebounceMacrotask {
  queue(fn: () => void): void
  cancel(fn: () => void): boolean
}
```

`queue` can create a macrotask,
if the macrotask is not executed, multiple calls will only queue it once.

`cancel` can cancel a macrotask before it is executed.

#### TaskRunner
```ts
class TaskRunnerDestroyedError extends CustomError {}

class TaskRunner {
  constructor(
    concurrency: number = Infinity
  , rateLimit?: {
      duration: number
      limit: number
    }
  )

  /**
   * @throws {TaskRunnerDestroyedError}
   */
  run(task: (signal: AbortSignal) => Awaitable<T>, signal?: AbortSignal): Promise<T>

  destroy(): void
}
```

A task runner, it will execute tasks in FIFO order.
