import { series } from '../src'

test('series(tasks)', async () => {
  const count = selfIncrease()
  const tasks = [
    () => count.next().value
  , () => count.next().value
  ]
  expect(await series(tasks)).toEqual([1, 2])
})

function* selfIncrease(): Iterator<number> {
  let i = 0
  while (true) yield ++i
}
