import delay from '../../src/fn/delay'

test('delay(fn, timeout)', async () => {
  function val(val) {
    return Promise.resolve(val)
  }

  const startTime = new Date()
  const result = await delay(val, 1000)('value')
  const endTime = new Date()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('value')
})

test('delay(fn)', async () => {
  function val(val) {
    return Promise.resolve(val)
  }

  const result = await delay(val)('value')

  expect(result).toEqual('value')
})

test('delay example', async () => {
  let result = null
  function output(x) {
    result = x
  }

  async function sayHello(name) {
    output(`${ name }: Hello.`)
  }
  const sayHelloAfterOneSecond = delay(sayHello, 1000)

  const startTime = new Date()
  await sayHelloAfterOneSecond('Jerry')
  const endTime = new Date()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('Jerry: Hello.')
})
