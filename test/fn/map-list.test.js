import mapList from '../../src/fn/map-list'
import delay from '../../src/fn/delay'

test('mapList(list)', async () => {
  const results = await mapList([0, 1, 2], x => {
    if (x === 0) {
      return Promise.reject('Zero')
    } else {
      return delay(() => new Date(), 1000)()
    }
  }, 1)
  expect(results[0]).toEqual('Zero')
  expect(results[2] - results[1] >= 1000).toBeTruthy()
})
