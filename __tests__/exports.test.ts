import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'delay'
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
  , 'pad'
  , 'toExtraPromise'
  , 'timeout'
  , 'TimeoutError'
  , 'queueConcurrency'
  , 'throttleConcurrency'
  , 'reusePendingPromise'

  , 'callbackify'

  , 'ExtraPromise'
  , 'ExtraPromiseState'

  , 'Deferred'
  , 'MutableDeferred'
  , 'ReusableDeferred'
  , 'LazyPromise'

  , 'Channel'
  , 'BufferedChannel'
  , 'UnlimitedChannel'
  , 'ChannelClosedError'

  , 'Signal'
  , 'SignalDiscarded'
  , 'SignalGroup'

  , 'Semaphore'
  , 'Mutex'

  , 'DebounceMicrotask'

  , 'TaskRunner'
  ].sort()

  const actualExports = Object.keys(target).sort()

  expect(actualExports).toEqual(expectedExports)
})
