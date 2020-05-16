# extra-promise [![npm](https://img.shields.io/npm/v/extra-promise.svg?maxAge=86400)](https://www.npmjs.com/package/extra-promise) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/extra-promise/master/LICENSE)

Utility for JavaScript Promise and AsyncFunction.

## Install

```sh
npm install --save extra-promise
# or
yarn add extra-promise
```

## API

### isPromise

`function isPromise<T>(val: any): val is PromiseLike<T>`

Check if the `val` has a `then` method.

### delay

`function delay(timeout: number): Promise<void>`

A simple wrapper for `setTimeout`.

### timeout

`function timeout(ms: number): Promise<never>`

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

### retryUntil

`function retryUntil<T, U = unknown>(fn: () => T | PromiseLike<T>, until: (error: U) => boolean | PromiseLike<boolean>): Promise<T>`

If `fn` function throws an error, continue to retry until the return value of the `until` function is true.

### parallel

`function parallel<T>(tasks: Iterable<() => T | PromiseLike<T>>, concurrency: number = Infinity): Promise<T[]>`

Perform tasks in parallel and return results in the same order.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### series

`function series<T>(tasks: Iterable<() => T | PromiseLike<T>>): Promise<T[]>`

Perform tasks in order and return results in order.
Equivalent to `parallel(tasks, 1)`.

### waterfall

`function waterfall<T>(tasks: Iterable<(result: unknown) => unknown | PromiseLike<unknown>>): Promise<T | undefined>`

Perform tasks in order, the return value of the previous task will become the parameter of the next task. If `tasks` is empty, return `Promise<undefined>`.

### each

`function each(iterable: Iterable<T>, fn: (element: T, i: number) => unknown | PromiseLike<unknown>, concurrency: number = Infinity): Promise<void>`

The async `each` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### map

`function map<T, U>(iterable: Iterable<T>, fn: (element: T, i: number) => U | PromiseLike<U>, concurrency: number = Infinity): Promise<U[]>`

The async `map` operator for Iterable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### filter

`function filter<T, U = T>(iterable: Iterable<T>, fn: (element: T, i: number) => boolean | PromiseLike<boolean>, concurrency: number = Infinity): Promise<U[]>`

The async `filter` operator for Iteable.

The value range of `concurrency` is [1, Infinity].
Invalid values will throw `InvalidArugmentError`.

### promisify

`function promisify<Result, Args extends any[] = unknown[]>(fn: (...args: any[]) => unknown): (...args: Args) => Promise<Result>`

The well-known `promisify` function.

### callbackify

`function callbackify<Result, Args extends any[] = unknown[]>(fn: (...args: Args) => PromiseLike<Result>): (...args: Args) => void`

The `callbackify` function, as opposed to `promisify`.

The return value:
* If `args.length = 0` then throw `InvalidArgumentsLengthError`.
* If the last element of args is not a function then throw `InvalidArugmentError`.
* If the error of it is a falsy value then wrap it into a `FalsyError`, the `reason` property is the real error.

### asyncify

`function asyncify<T extends any[], U>(fn: (...args: T) => U | PromiseLike<U>): (...args: Promisify<T>) => Promise<U>`

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

`function cascadify<T extends object>(target: T): Cascadify<T>`

Use the decorator `cascadable` to mark the cascadable methods (the return value is `PromiseLike<this>`), transform the instance into a cascadify instance, and end with the non-cascadable member.

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

  @cascadable
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

### makeChannel, makeBlockingChannel

* `function makeChannel(): [(value: T) => void, () => AsyncIterable<T>, () => void]`
* `function makeBlockingChannel(bufferSize: number): [(value: T) => Promise<void>, () => AsyncIterable<T>, () => void]`

Implement "multi-producer, single-consumer" FIFO queue communication with `Promise` and `AsyncIterable`.

`makeChannel` return a tuple includes three channel functions:
* `function send(value: T): void`
* `function receive(): AsyncIterable<T>`)
* `function close(): void`

`makeBlockingChannel` is the asynchronous blocking version of `makeChannel` implemented with `Promise`.
When the amount of data sent exceeds `bufferSize`, blocking will occur until data is taken out by the consumer.

`makeBlockingChannel` return a tuple includes three channel functions:
* `function send(value: T): Promise<void>`
* `function receive(): AsyncIterable<T>`)
* `function close(): void`

If the channel closed, `send()` will throw `ChannelClosedError`.

```ts
// makeChannel
const [send, receive, close] = makeChannel<string>()

queueMicrotask(() => {
  send('hello')
  send('world')
  close()
})

for await (const value of receive()) {
  console.log(value)
}

// makeBlockingChannel
const [send, receive, close] = makeBlockingChannel<string>(1)

queueMicrotask(() => {
  await send('hello')
  await send('world')
  close()
})

for await (const value of receive()) {
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
  refresh(): void
}
```

The `emit()` changes the internal Promise to resovled.

The `refresh()` re-creates the internal Promise, the old Promise throw `SignalDiscarded`.
