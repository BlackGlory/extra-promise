import promisify from '../src/promisify'

type Callback = (err: any, result?: any) => void

test('promisify(fn.resolve)', async () => {
  function alarm(timeout = 0, callback: Callback) {
    setTimeout(() => callback(null, 'ALARM!!!'), timeout)
  }

  const startTime = new Date().getTime()
  const result = await promisify(alarm)(1000)
  const endTime = new Date().getTime()

  expect(endTime - startTime >= 1000).toBeTruthy()
  expect(result).toEqual('ALARM!!!')
})

test('promisify(fn.reject)', async () => {
  function alert(timeout = 0, callback: Callback) {
    setTimeout(() => callback('ALERT!!!'), timeout)
  }

  const startTime = new Date().getTime()
  try {
    const result = await promisify(alert)(1000)
    expect(true).toBe(false)
  } catch (e) {
    expect(e).toEqual('ALERT!!!')
  }
  const endTime = new Date().getTime()

  expect(endTime - startTime >= 1000).toBeTruthy()
})

test('promisify example', async () => {
  const add = (a: number, b: number, callback: Callback) => callback(null, a + b)
  const asyncAdd = promisify(add)
  const result = await asyncAdd(1, 2)
  expect(result).toEqual(3)
})
