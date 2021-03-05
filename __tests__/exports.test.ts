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
  , 'retryUntil'
  , 'parallel'
  , 'series'
  , 'waterfall'
  , 'each'
  , 'map'
  , 'filter'
  , 'promisify'
  , 'asyncify'
  , 'pad'

  , 'timeout'
  , 'TimeoutError'
  , 'timeoutSignal'

  , 'cascadify'
  , 'Cascadable'

  , 'callbackify'
  , 'FalsyError'

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
