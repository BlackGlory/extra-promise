import everyDictionary from '../../src/fn/every-dictionary'
import delay from '../../src/fn/delay'

test('everyDictionary(dictionary)', async () => {
  const results = await everyDictionary(
    {
      zero: 0
    , one: 1
    }
  , delay(() => new Date(), 1000)
  , 1)

  expect(results.one - results.zero >= 1000).toBeTruthy()
})

test('everyDictionary(dictionary.reject)', async () => {
  try {
    const results = await everyDictionary(
      {
        zero: 0
      , one: 1
      }
    , x => {
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

test('everyDictionary example', async () => {
  const double = async x => x * 2
  const dictionary = {
    a: 1
  , b: 2
  , c: 3
  }

  const newDictionary = await everyDictionary(dictionary, double)
  expect(newDictionary).toEqual({ a: 2, b: 4, c: 6 })
})
