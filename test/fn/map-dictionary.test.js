import mapDictionary from '../../src/fn/map-dictionary'
import delay from '../../src/fn/delay'

test('mapDictionary(dictionary)', async () => {
  const results = await mapDictionary(
    {
      zero: 0
    , one: 1
    , two: 2
    }
  , x => {
    if (x === 0) {
      return Promise.reject('Zero')
    } else {
      return delay(() => new Date(), 1000)()
    }
  }, 1)

  expect(results.zero).toEqual('Zero')
  expect(results.two - results.one >= 1000).toBeTruthy()
})
