import * as extraPromise from '../src/extra-promise'

test('extra-promise', () => {
  expect(Object.keys(extraPromise)).toEqual([
    'delay'
  , 'eachDictionary'
  , 'eachList'
  , 'each'
  , 'everyDictionary'
  , 'everyList'
  , 'every'
  , 'isPromise'
  , 'mapDictionary'
  , 'mapList'
  , 'map'
  , 'promisify'
  , 'retry'
  , 'sleep'
  , 'warn'
  ])
})
