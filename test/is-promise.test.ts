import isPromise from '../src/is-promise'

test('isPromise(obj)', async () => {
  const promise = Promise.resolve()
  expect(isPromise(promise)).toBeTruthy()
  expect(isPromise({})).toBeFalsy()
})

test('isPromise example', async () => {
  expect(isPromise(Promise.resolve())).toBeTruthy()
  expect(isPromise(Promise.reject(new Error()))).toBeTruthy()
  expect(isPromise(Promise)).toBeFalsy()
  expect(isPromise({ then: () => undefined })).toBeTruthy()
})
