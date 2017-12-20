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

test('mapDictionary example', async () => {
  async function oneHundredDividedBy(x) {
    if (x === 0) {
      throw new RangeError('Divisor cannot be 0')
    }
    return 100 / x
  }

  const dictionary = {
    a: 0
  , b: 1
  , c: 2
  }

  const newDictionary = await mapDictionary(dictionary, oneHundredDividedBy)
  expect(newDictionary).toEqual({
    a: RangeError('Divisor cannot be 0')
  , b: 100
  , c: 50
  })
})
