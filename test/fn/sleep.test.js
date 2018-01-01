'use strict'

import sleep from '../../src/fn/sleep'

test('sleep(timeout)', async () => {
  const startTime = new Date()
  await sleep(1000)
  const endTime = new Date()
  expect(endTime - startTime >= 1000).toBeTruthy()
})

test('sleep()', async () => {
  const sleepTime = await sleep()
  expect(sleepTime >= 0).toBeTruthy()
})

test('sleep example', async () => {
  const startTime = new Date()
  await sleep(2000)
  const endTime = new Date()
  expect(endTime - startTime >= 2000).toBeTruthy()
})
