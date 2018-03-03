'use strict'

import each from '../../src/fn/each'
import sleep from '../../src/fn/sleep'

function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max + 1 - min))
}

test('each example', async () => {
  const result: string[] = []
  function output(x: string) {
    result.push(x)
  }
  async function printDouble(v: number, i: number) {
    await sleep(generateRandomInteger(0, 2000))
    output(`[${ i }] = ${ v * 2 }`)
  }
  const list = [1, 2, 3]
  await each(list, printDouble, 1)

  expect(result).toEqual([
    '[0] = 2'
  , '[1] = 4'
  , '[2] = 6'
  ])
})

test('each(Set)', async () => {
  const result: number[] = []
  function output(x: number) {
    result.push(x)
  }
  const printDouble = async (x: number) => output(x * 2)
  const list = new Set([1, 2, 3])
  await each(list, printDouble)

  expect(result).toEqual([2, 4, 6])
})

test('each(Generator)', async () => {
  const result: number[] = []
  function output(x: number) {
    result.push(x)
  }

  function* doubleCounter(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      yield (async () => output(i * 2))()
    }
  }

  await each(doubleCounter(1, 3))

  expect(result).toEqual([2, 4, 6])
})

test('each concurrency', async () => {
  const result: number[] = []
  const list = [1, 1, 1]
  await each(list, async x => {
    await sleep(x * 1000)
    result.push(new Date().getTime())
  }, 1)

  expect(result.length).toEqual(3)
  expect(result[1] - result[0] >= 1000).toBeTruthy()
  expect(result[2] - result[1] >= 1000).toBeTruthy()
})
