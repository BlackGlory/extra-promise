'use strict'

import promisify from '../../src/fn/promisify'

test('promisify(fn.resolve)', async () => {
  function alarm(timeout = 0, callback) {
    setTimeout(() => callback(null, 'ALARM!!!'), timeout)
  }

  const startTime = new Date()
  const result = await promisify(alarm)(1000)
  const endTime = new Date()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('ALARM!!!')
})

test('promisify(fn.reject)', async () => {
  function alert(timeout = 0, callback) {
    setTimeout(() => callback('ALERT!!!'), timeout)
  }

  const startTime = new Date()
  try {
    const result = await promisify(alert)(1000)
    expect(true).toBe(false)
  } catch(e) {
    expect(e).toEqual('ALERT!!!')
  }
  const endTime = new Date()

  expect(endTime - startTime >= 1000).toBeTruthy()
})

test('promisify example', async () => {
  const add = (a, b, callback) => callback(null, a + b)
  const asyncAdd = promisify(add)
  const result = await asyncAdd(1, 2)
  expect(result).toEqual(3)
})
