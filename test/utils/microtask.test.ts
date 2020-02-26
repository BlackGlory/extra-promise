import { debounceMicrotask, cancelMicrotask } from '../../src/utils/microtask'

test('debounceMicrotask', async () => {
  let count = 0
  debounceMicrotask(increase)
  debounceMicrotask(increase)
  await Promise.resolve()
  expect(count).toBe(1)

  function increase() {
    count++
  }
})

test('cancelMicrotask', async () => {
  let count = 0
  debounceMicrotask(increase)
  debounceMicrotask(increase)
  cancelMicrotask(increase)
  await Promise.resolve()
  expect(count).toBe(0)

  function increase() {
    count++
  }
})
