import { sleep } from '../../src/sleep'
import { TaskRunner } from '../../src/utils/task-runner'

test('TaskRunner set concurrency', () => {
  const runner = new TaskRunner()
  expect(() => runner.concurrency = 0).toThrow()
  expect(() => runner.concurrency = 1.5).toThrow()
})

test('TaskRunner completed', done => {
  const runner = new TaskRunner()
  runner.once('completed', completed)
  runner.once('error', fail)

  const start = getTime()
  runner.add(() => sleep(500))

  function completed() {
    expect(getTime() - start).toBeGreaterThanOrEqual(500)
    done()
  }
})

test('TaskRunner error', done => {
  const runner = new TaskRunner()
  runner.once('completed', fail)
  runner.once('error', error)

  runner.add(() => { throw new Error('rejected') })

  function error(err: Error) {
    expect(err.message).toBe('rejected')
    done()
  }
})

test('TaskRunner cold start', async done => {
  const runner = new TaskRunner()
  runner.once('completed', completed)
  runner.once('error', fail)
  runner.pause()

  const start = getTime()
  await sleep(500)
  runner.add(() => sleep(500))
  runner.resume()

  function completed() {
    expect(getTime() - start).toBeGreaterThanOrEqual(1000)
    done()
  }
})

test('TaskRunner withdraw', async done => {
  const runner = new TaskRunner()
  runner.concurrency = 1
  runner.once('completed', done)
  runner.once('error', fail)

  const remains = () => 'withdraw'
  runner.add(() => sleep(500))
  runner.add(remains)
  await sleep(500)
  runner.pause()
  expect(runner.withdraw()).toEqual([remains])
  runner.resume()
})

function getTime() {
  return new Date().getTime()
}
