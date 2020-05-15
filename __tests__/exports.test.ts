import * as target from '@src/index'

test('exports', () => {
  const expectedExports: string[] = [
    'InvalidArgumentError'
  , 'InvalidArgumentsLengthError'

  , 'isPromise'
  , 'delay'
  , 'timeout', 'TimeoutError'
  , 'retryUntil'
  , 'parallel'
  , 'series'
  , 'waterfall'
  , 'each'
  , 'map'
  , 'filter'
  , 'promisify'
  , 'callbackify', 'FalsyError'
  , 'asyncify'
  , 'cascadify', 'cascadable'
  , 'makeChannel', 'makeBlockingChannel', 'ChannelClosedError'

  , 'Deferred'
  , 'LazyPromise'
  , 'Signal', 'SignalDiscarded'
  ].sort()

  const actualExports = Object.keys(target).sort()

  expect(actualExports).toEqual(expectedExports)
})
