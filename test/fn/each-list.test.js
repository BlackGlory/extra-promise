import eachList from '../../src/fn/each-list'
import delay from '../../src/fn/delay'

test('eachList(list)', async () => {
  let callTiming = []
  const result = await eachList([0, 1, 2], x => {
    if (x === 0) {
      return Promise.reject('Zero')
    } else {
      return delay(() => callTiming.push(new Date()), 1000)()
    }
  }, 1)
  expect(result).toBeUndefined()
  expect(callTiming.length).toEqual(2)
  expect(callTiming[1] - callTiming[0] >= 1000).toBeTruthy()
})

test('eachList example', async () => {
  let result = []
  function output(x) {
    result.push(x)
  }
  const printDouble = async x => output(x * 2)
  const list = [1, 2, 3]
  await eachList(list, printDouble)
  expect(result).toEqual([2, 4, 6])
})
