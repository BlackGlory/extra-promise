import every from '../../src/fn/every'

test('every(list)', async () => {
  const results = await every([1, 2, 3], x => Promise.resolve(x * 10))
  expect(results).toEqual([10, 20, 30])
})

test('every(dictionary)', async () => {
  const results = await every({
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

test('every()', async () => {
  try {
    await every()
    expect(true).toBe(false)
  } catch(e) {}
})
