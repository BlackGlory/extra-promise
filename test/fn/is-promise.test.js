import isPromise from '../../src/fn/is-promise'

test('isPromise(obj)', async () => {
  const promise = Promise.resolve()
  expect(isPromise(promise)).toBeTruthy()
  expect(isPromise({})).toBeFalsy()
})
