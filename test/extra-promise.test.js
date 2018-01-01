'use strict'

import * as extraPromise from '../src/extra-promise'

test('extra-promise', () => {
  expect(Object.keys(extraPromise)).toEqual([
    'chain'
  , 'delay'
  , 'each'
  , 'fix'
  , 'isPromise'
  , 'map'
  , 'promisify'
  , 'retry'
  , 'silent'
  , 'sleep'
  , 'warn'
  ])
})
