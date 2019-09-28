import { LazyPromise } from '../../src'

test('LazyPromise', async () => {
  let count = 0
  const increase = new LazyPromise<number>(resolve => {
    resolve(count++)
  })

  await Promise.resolve() // queueMicrotask()
  expect(count).toBe(0)
  expect(await increase).toBe(0)
  expect(count).toBe(1)
  expect(await increase).toBe(0)
  expect(count).toBe(1)
})
