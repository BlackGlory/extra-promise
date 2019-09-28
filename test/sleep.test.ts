import { sleep } from '../src'

test('sleep()', async () => {
  const sleepTime = await sleep()
  expect(sleepTime >= 0).toBeTruthy()
})

test('sleep(timeout)', async () => {
  const startTime = new Date().getTime()
  await sleep(500)
  const endTime = new Date().getTime()
  expect(endTime - startTime >= 500).toBeTruthy()
})
