import eachDictionary from '../../src/fn/each-dictionary'
import delay from '../../src/fn/delay'

test('eachDictionary(dictionary)', async () => {
  let callTiming = []
  const result = await eachDictionary(
    {
      zero: 0
    , one: 1
    , two: 2
    }
  , x => {
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
