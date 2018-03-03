'use strict'

import warn from '../../src/fn/warn'

test('warn(fn, warn)', async () => {
  global.console.warn = jest.fn()
  const result = await warn(() => Promise.reject('Warning'))()
  expect(result).toBeUndefined()
  expect(console.warn).toHaveBeenCalledTimes(1)
  expect(console.warn).toHaveBeenCalledWith('Warning')
})

test('warn example', async () => {
  let result
  function output(x: any) {
    result = x
  }

  const problemMaker = (text: any) => Promise.reject(text)
  const buzzer = (e: any) => output(`WARNING: ${ e }`)
  const problemMakerWithBuzzer = warn(problemMaker, buzzer)

  await problemMakerWithBuzzer('Fire!')
  expect(result).toEqual('WARNING: Fire!')
})
