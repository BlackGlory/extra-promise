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

  , 'cascadify'
  , 'Cascadable'

  , 'callbackify'

  , 'ExtraPromise'

  , 'Deferred'
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
