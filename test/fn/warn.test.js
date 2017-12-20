import warn from '../../src/fn/warn'

test('warn(fn, warn)', async () => {
  const buzzer = jest.fn()
  const result = await warn(() => Promise.reject('Warning'), buzzer)()
  expect(result).toBeUndefined()
  expect(buzzer).toHaveBeenCalledTimes(1)
  expect(buzzer).toHaveBeenCalledWith('Warning')
})
