import warn from '../../src/fn/warn'

test('warn(fn, warn)', async () => {
  const warner = jest.fn()
  const result = await warn(() => Promise.reject('Warning'), warner)()
  expect(result).toBeUndefined()
  expect(warner).toHaveBeenCalledTimes(1)
  expect(warner).toHaveBeenCalledWith('Warning')
})
