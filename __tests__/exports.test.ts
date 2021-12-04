import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'isPromise'
  , 'isPromiseLike'
  , 'isntPromise'
  , 'isntPromiseLike'
  , 'delay'
  , 'parallel'
  , 'series'
  , 'waterfall'
  , 'spawn'
  , 'each'
  , 'map'
  , 'filter'
  , 'all'
  , 'promisify'
  , 'asyncify'
  , 'pad'
  , 'withAbortSignal'
  , 'raceAbortSignals'
  , 'toExtraPromise'
  , 'AbortError'
  , 'timeout'
  , 'TimeoutError'
  , 'timeoutSignal'
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
