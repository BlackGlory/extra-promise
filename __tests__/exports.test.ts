import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'isPromise'
  , 'isPromiseLike'
  , 'isntPromise'
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
  , 'pad'
  , 'toExtraPromise'
  , 'timeout'
  , 'TimeoutError'
  , 'queueConcurrency'
  , 'throttleConcurrency'
  , 'throttleUntilDone'

  , 'cascadify'
  , 'Cascadable'

  , 'callbackify'

  , 'ExtraPromise'

  , 'Deferred'
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
