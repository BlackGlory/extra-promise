import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'isPromise'
  , 'isntPromise'
  , 'isPromiseLike'
  , 'isntPromiseLike'
  , 'delay'
  , 'parallel'
  , 'parallelAsync'
  , 'series'
  , 'waterfall'
  , 'spawn'
  , 'each'
  , 'eachAsync'
  , 'map'
  , 'mapAsync'
  , 'filter'
  , 'filterAsync'
  , 'all'
  , 'promisify'
  , 'asyncify'
  , 'callbackify'
  , 'pad'
  , 'timeout'
  , 'TimeoutError'
  , 'limitConcurrencyByQueue'
  , 'reusePendingPromises'

  , 'StatefulPromise'
  , 'StatefulPromiseState'

  , 'Deferred'
  , 'MutableDeferred'
  , 'ReusableDeferred'
  , 'DeferredGroup'
  , 'LazyPromise'

  , 'Channel'
  , 'BufferedChannel'
  , 'UnlimitedChannel'
  , 'ChannelClosedError'

  , 'Semaphore'
  , 'Mutex'

  , 'DebounceMicrotask'
  , 'DebounceMacrotask'

  , 'TaskRunner'
  ].sort()

  const actualExports = Object.keys(target).sort()

  expect(actualExports).toEqual(expectedExports)
})
