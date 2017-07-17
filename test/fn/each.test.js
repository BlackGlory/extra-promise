import each from '../../src/fn/each'
import delay from '../../src/fn/delay'

// Copy from each-list.test.js, replace eachList to each
test('each(list)', async () => {
  let callTiming = []
  const result = await each([0, 1, 2], x => {
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

// Copy from each-dictionary.test.js, replace eachDictionary to each
test('each(dictionary)', async () => {
  let callTiming = []
  const result = await each(
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


test('each()', async () => {
  try {
    await each()
    expect(true).toBe(false)
  } catch(e) {}
})
