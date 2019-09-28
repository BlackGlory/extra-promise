import { waterfall } from '../src'

test('waterfall(tasks)', async () => {
  const count = selfIncrease()
  const tasks = [
    () => count.next().value
  , (val: number) => val + count.next().value
  ]
  expect(await waterfall(tasks)).toEqual(3)
})

function* selfIncrease(): Iterator<number> {
  let i = 0
  while (true) yield ++i
}
