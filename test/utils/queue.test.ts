import { Queue } from '../../src/utils/queue'

test('Queue', () => {
  const queue = new Queue<number>()

  expect(queue.size).toBe(0)
  expect(() => queue.dequeue()).toThrow('Queue is empty.')

  queue.enqueue(1, 2)
  expect(queue.size).toBe(2)

  expect(queue.dequeue()).toBe(1)
  expect(queue.size).toBe(1)

  expect(queue.dequeue()).toBe(2)
  expect(queue.size).toBe(0)
})
