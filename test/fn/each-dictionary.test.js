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

test('eachDictionary example', async () => {
  let result = []
  function output(x) {
    result.push(x)
  }
  const printDouble = async x => output(x * 2)
  const dictionary = {
    a: 1
  , b: 2
  , c: 3
  }
  await eachDictionary(dictionary, printDouble)
  expect(result).toEqual([2, 4, 6])
})
