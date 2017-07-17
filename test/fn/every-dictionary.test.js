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
