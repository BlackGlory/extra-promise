import everyList from '../../src/fn/every-list'
import delay from '../../src/fn/delay'

test('everyList(list)', async () => {
  const results = await everyList([0, 1], delay(() => new Date(), 1000), 1)
  expect(results[1] - results[0] >= 1000).toBeTruthy()
})

test('everyList(list.reject)', async () => {
  try {
    const results = await everyList([0 ,1], x => {
      if (x === 0) {
        return Promise.reject('Zero')
      } else {
        return Promise.resolve(x)
      }
    })
    expect(true).toBe(false)
  } catch(e) {
    expect(e).toEqual('Zero')
  }
})

test('everyList example', async () => {
  const double = async x => x * 2
  const list = [1, 2, 3]

  const newList = await everyList(list, double)
  expect(newList).toEqual([2, 4, 6])
})
