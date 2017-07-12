import everyList from '../../src/fn/every-list'

test('everyList(list)', async () => {
  const results = await everyList([0, 1], x => {
    return new Promise(resolve => {
      setTimeout(() => resolve(new Date()), 1000)
    })
  }, 1)
  expect(results[1] - results[0] >= 1000).toBeTruthy()
})

test('everyList(list.reject)', async () => {
  try {
    const results = await everyList([0 ,1], x => {
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
