'use strict'

import delay from '../../src/fn/delay'

test('delay(fn, timeout)', async () => {
  function val(val: string) {
    return Promise.resolve(val)
  }

  const startTime = new Date().getTime()
  const result = await delay(val, 1000)('value')
  const endTime = new Date().getTime()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('value')
})

test('delay(fn)', async () => {
  function val(val: string) {
    return Promise.resolve(val)
  }

  const result = await delay(val)('value')

  expect(result).toEqual('value')
})

test('delay example', async () => {
  let result: string = ''
  function output(x: string) {
    result = x
  }

  async function sayHello(name: string) {
    output(`${ name }: Hello.`)
  }
  const sayHelloAfterOneSecond = delay(sayHello, 1000)

  const startTime = new Date().getTime()
  await sayHelloAfterOneSecond('Jerry')
  const endTime = new Date().getTime()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('Jerry: Hello.')
})
