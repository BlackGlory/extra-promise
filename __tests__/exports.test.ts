import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'InvalidArgumentError'
  , 'InvalidArgumentsLengthError'

  , 'isPromise'
  , 'isPromiseLike'
  , 'isntPromise'
  , 'isntPromiseLike'
  , 'delay'
  , 'parallel'
  , 'series'
  , 'waterfall'
  , 'each'
  , 'map'
  , 'filter'
  , 'promisify'
  , 'asyncify'
  , 'pad'
  , 'withAbortSignal'
  , 'toExtraPromise'
  , 'AbortError'
  , 'timeout'
  , 'TimeoutError'
  , 'timeoutSignal'

  , 'cascadify'
  , 'Cascadable'

  , 'callbackify'
  , 'FalsyError'

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
