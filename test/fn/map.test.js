'use strict'

import map from '../../src/fn/map'
import sleep from '../../src/fn/sleep'

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
}

test('map example', async () => {
  async function oneHundredDividedBy(v, i) {
    await sleep(generateRandomInteger(0, 2000))
    return 100 / v
  }
  const list = [1, 2, 4]

  const newList = await map(list, oneHundredDividedBy)
  expect(newList).toEqual([100, 50, 25])
})

test('map(Set)', async () => {
  async function oneHundredDividedBy(x) {
    return 100 / x
  }
  const list = new Set([1, 2, 4])

  const newList = await map(list, oneHundredDividedBy)
  expect(newList).toEqual([100, 50, 25])
})

test('map(Generator)', async () => {
  function* counter(start, end) {
    for (let i = start; i <= end; i++) {
      yield Promise.resolve(i)
    }
  }

  const result = await map(counter(1, 5))
  expect(result).toEqual([1, 2, 3, 4, 5])
})

test('map concurrency', async () => {
  const list = [1, 1, 1]
  const result = await map(list, async x => {
    await sleep(x * 1000)
    return new Date()
  }, 1)

  expect(result.length).toEqual(3)
  expect(result[1] - result[0] >= 1000).toBeTruthy()
  expect(result[2] - result[1] >= 1000).toBeTruthy()
})
