import warn from '../../src/fn/warn'

test('warn(fn, warn)', async () => {
  const buzzer = jest.fn()
  const result = await warn(() => Promise.reject('Warning'), buzzer)()
  expect(result).toBeUndefined()
  expect(buzzer).toHaveBeenCalledTimes(1)
  expect(buzzer).toHaveBeenCalledWith('Warning')
})

test('warn example', async () => {
  let result = null
  function output(x) {
    result = x
  }

  const problemMaker = text => Promise.reject(text)
  const buzzer = e => output(`WARNING: ${ e }`)
  const problemMakerWithBuzzer = warn(problemMaker, buzzer)

  await problemMakerWithBuzzer('Fire!')
  expect(result).toEqual('WARNING: Fire!')
})
