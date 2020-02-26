import { isPromise } from '../src'

test('isPromise(PromiseLike)', () => {
  expect(isPromise({ then: () => undefined })).toBeTruthy()
})

test('isPromise(null)', () => {
  expect(isPromise(null)).toBeFalsy()
})
