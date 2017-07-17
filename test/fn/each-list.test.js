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
