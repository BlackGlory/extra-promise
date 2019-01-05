import { filter } from '../src/filter'
import { sleep } from '../src/sleep'

test('filter example', async () => {
  function isEven(num: number) {
    return new Promise(resolve => {
      setTimeout(
        () => resolve(num % 2 === 0)
      , 1000)
    })
  }

  const list = [1, 2, 3, 4, 5]
  const newList = await filter(list, isEven)
  expect(newList).toEqual([2, 4])
})

test('filter(Set)', async () => {
  const list = new Set([0, 1, 2])
  const newList = await filter(list)
  expect(newList).toEqual([1, 2])
})

test('filter(Generator)', async () => {
  function* counter(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      yield i
    }
  }

  const newList = await filter(counter(0, 2))
  expect(newList).toEqual([1, 2])
})

test('filter concurrent', async () => {
  const result: number[] = []
  const list = [1, 1, 1]
  await filter(list, async x => {
    await sleep(x * 1000)
    result.push(new Date().getTime())
  }, 1)

  expect(result.length).toEqual(3)
  expect(result[1] - result[0] >= 1000).toBeTruthy()
  expect(result[2] - result[1] >= 1000).toBeTruthy()
})
