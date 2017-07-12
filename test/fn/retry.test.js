import retry from '../../src/fn/retry'

test('retry(func)', async () => {
  let called = 0

  function callMeTimes(times) {
    called++
    return new Promise((resolve, reject) => {
      if (called === times) {
        resolve()
      } else {
        reject()
      }
    })
  }

  await retry(callMeTimes)(2)

  expect(called).toEqual(2)
})

test('retry(func, maxRetryCount)', async () => {
  let called = 0

  function callMeTimes(times) {
    called++
    return new Promise((resolve, reject) => {
      if (called === times) {
        resolve()
      } else {
        reject()
      }
    })
  }

  try {
    await retry(callMeTimes, 2)(4)
    expect(true).toBe(false)
  } catch(e) {
    expect(Array.isArray(e)).toBeTruthy()
    expect(called).toEqual(3)
  }
})

test('retry(func, maxRetryCount, retryInterval)', async () => {
  let called = 0

  function callMeTimes(times) {
    called++
    return new Promise((resolve, reject) => {
      if (called === times) {
        resolve()
      } else {
        reject()
      }
    })
  }

  const startTime = new Date()
  await retry(callMeTimes, 2, 1000)(3)
  const endTime = new Date()

  expect(called).toEqual(3)
  expect(endTime - startTime >= 2000).toBeTruthy()
})
