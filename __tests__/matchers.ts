import { isPromiseLike } from '@functions/is-promise-like'
import { isPromise } from '@functions/is-promise'

/* eslint-disable */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBePromise(): R
      toBePromiseLike(): R
    }
  }
}
/* eslint-enable */

expect.extend({
  toBePromise(received: unknown) {
    if (isPromise(received)) {
      return {
        message: () => `expected ${received} not to be a Promise`
      , pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a Promise`
      , pass: false
      }
    }
  }
, toBePromiseLike(received: unknown) {
    if (isPromiseLike(received)) {
      return {
        message: () => `expected ${received} not to be a PromiseLike`
      , pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a PromiseLike`
      , pass: false
      }
    }
  }
})
