import map from '../../src/fn/map'

test('map(list)', async () => {
  const results = await map([1, 2, 3], x => Promise.resolve(x * 10))
  expect(results).toEqual([10, 20, 30])
})

test('map(dictionary)', async () => {
  const results = await map({
    a: 1
  , b: 2
  , c: 3
  }, x => Promise.resolve(x * 10))

  expect(results).toEqual({
    a: 10
  , b: 20
  , c: 30
  })
})

test('map()', async () => {
  try {
    await map()
    expect(true).toBe(false)
  } catch(e) {}
})
