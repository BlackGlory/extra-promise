import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'InvalidArgumentError'
  , 'InvalidArgumentsLengthError'

  , 'isPromise'
  , 'isPromiseLike'
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

  , 'cascadify'
  , 'cascadable'

  , 'callbackify'
  , 'FalsyError'

  , 'makeChannel'
  , 'makeBufferedChannel'
  , 'makeUnlimitedChannel'
  , 'ChannelClosedError'

  , 'Deferred'
  , 'LazyPromise'

  , 'Signal'
  , 'SignalDiscarded'

  , 'Semaphore'
  , 'Mutex'
  ].sort()

  const actualExports = Object.keys(target).sort()

  expect(actualExports).toEqual(expectedExports)
})
