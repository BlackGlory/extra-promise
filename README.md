# extra-promise [![npm](https://img.shields.io/npm/v/extra-promise.svg?maxAge=2592000)](https://www.npmjs.com/package/extra-promise) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/extra-promise/master/LICENSE) [![Build Status](https://travis-ci.org/BlackGlory/extra-promise.svg?branch=master)](https://travis-ci.org/BlackGlory/extra-promise) [![Coverage Status](https://coveralls.io/repos/github/BlackGlory/extra-promise/badge.svg)](https://coveralls.io/github/BlackGlory/extra-promise)

Utilities for using Promise and Async/Await in JavaScript

## Installation

```sh
yarn add extra-promise
```

```javascript
import extraPromise from 'extra-promise'
import { chain, delay, each, fix, isPromise, map, promisify, retry, silent, sleep, warn } from 'extra-promise'
```

## API

#### Table of Contents

-   [chain](#chain)
-   [delay](#delay)
-   [each](#each)
-   [fix](#fix)
-   [isPromise](#ispromise)
-   [map](#map)
-   [promisify](#promisify)
-   [retry](#retry)
-   [silent](#silent)
-   [sleep](#sleep)
-   [warn](#warn)

### chain

Make asynchronous chained calls easy to write.

**Parameters**

-   `target` **([Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** A target that needs asynchronous chained calls

**Examples**

```javascript
class Calculator {
  constructor(initialValue) {
    this.value = initialValue
  }

  async get() {
    return this.value
  }

  async add(value) {
    this.value += value
    return this
  }

  async sub(value) {
    this.value -= value
    return this
  }
}

;(async () => {
  // use chain()
  console.log(
    await chain(new Calculator(100))
      .add(50)
      .sub(100)
      .get()
  ) // 50

  // use await only
  console.log(
    await (
      await (
        await (
          new Calculator(100).add(50)
        )
      ).sub(100)
    ).get()
  ) // 50

  // use then() only
  new Calculator(100).add(50)
    .then(x => x.sub(100))
    .then(x => x.get())
    .then(console.log) // 50
})()
```

Returns **[Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy)&lt;[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)>** The Proxy object that supports asynchronous chained calls

### delay

Wrap an async function as a delayed async function.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** An async function that needs wrap
-   `timeout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** delay(ms)

**Examples**

```javascript
async function sayHello(name) {
  console.log(`${ name }: Hello.`)
}

const sayHelloAfterOneSecond = delay(sayHello, 1000)

;(async () => {
  await sayHelloAfterOneSecond('Jerry')

  // same as
  await sleep(1000)
  await sayHello('Jerry')
})()
```

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The wrapped async function

### each

Traverse an iterable object through a function.

**Parameters**

-   `iterable` **iterable** An iterable object
-   `fn` **function (v, i)** A function
-   `concurrency` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The maximum number of concurrency

**Examples**

```javascript
function printDouble(v, i) {
  return new Promise(resolve => {
    setTimeout(() => {
      output(`[${ i }] = ${ v * 2 }`)
      resolve()
    }, 1000)
  })
}

const list = [1, 2, 3]

;(async () => {
  await each(list, printDouble, 1)
  // [0] = 2
  // [1] = 4
  // [2] = 6
})()
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>**

### fix

Add a fixer to an async function and automatic retry after the fixing.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** A fixable async function
-   `fixer` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** A function can fix fn's problem

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The wrapped async function

### isPromise

Check if an object is a Promise instance.

**Parameters**

-   `obj` **any** An object needs to be checked

**Examples**

```javascript
isPromise(Promise.resolve()) // true
isPromise(Promise.reject()) // true
isPromise(Promise) // false
isPromise({ then() {} }) // true
```

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Result

### map

Convert an iterable object to results through a function.

**Parameters**

-   `iterable` **iterable** An iterable object
-   `fn` **function (v, i)** A function
-   `concurrency` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The maximum number of concurrency

**Examples**

```javascript
function oneHundredDividedBy(v, i) {
  return new Promsie(resolve => {
    setTimeout(() => {
      resolve(100 / v)
    }, Math.floor(0 + Math.random() * (2000 + 1 - 0))) // Random 0ms ~ 2000ms
  })
}

const list = [1, 2, 4]

;(async () => {
  const newList = await map(list, oneHundredDividedBy)
  console.log(newList)
  // [100, 50, 25]
})()
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)>** Results

### promisify

Convert a function that needs a callback to async function.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** A function that needs convert

**Examples**

```javascript
const add = (a, b, callback) => callback(null, a + b)
const asyncAdd = promisify(add)
;(async () => {
  const result = await asyncAdd(1, 2) // 3
})()
```

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The converted async function

### retry

Wrap an async function as an async function that will retry when meet Rejected, and if it still fails after all retry, return the last exception.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** An async function that needs wrap
-   `maxRetries` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The maximum number of retries
-   `retryInterval` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Retry interval(ms)

**Examples**

```javascript
function threeOrOut() {
  let times = 0
  return async () => {
    times++
    if (times < 3) {
      throw new Error('need more')
    }
    return times
  }
}
const threeOrOutWithRetry = retry(threeOrOut(), 3)

;(async () => {
  const result = await threeOrOutWithRetry()
  console.log(result) // 3
})()
```

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The wrapped async function

### silent

Wrap an async function as an async function that will never throw an exception.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The async function that needs wrap

**Examples**

```javascript
async function noiseMaker() {
  throw new Error('New problem!')
}

const silentMaker = pass(noiseMaker)

;(async () => {
  await silentMaker()
  console.log('Wow! no problem?')
})()
```

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The wrapped async function

### sleep

A setTimeout async function.

**Parameters**

-   `timeout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Timeout(ms)

**Examples**

```javascript
;(async () => {
  console.log('I will print something in 2s...')
  await sleep(2000) // sleep two seconds.
  console.log('something')
})()
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Elapsed time(ms)

### warn

Wrap an async function be will only invoke a warning function when Promise status is Rejected without interrupting the running.

**Parameters**

-   `fn` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The async function that needs wrap
-   `buzzer` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** A function to receive the exception

**Examples**

```javascript
const problemMaker = text => Promise.reject(text)
const buzzer = e => console.warn(`WARNING: ${ e }`)
const problemMakerWithBuzzer = warn(problemMaker, buzzer)

;(async () => {
  await problemMakerWithBuzzer('Fire!')
})()
```

Returns **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** The wrapped async function
