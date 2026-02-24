import { Semaphore } from '@classes/semaphore.js'
import { TIME_ERROR } from '@test/utils.js'
import { getErrorPromise } from 'return-style'

class TestSemaphore extends Semaphore {
  getUsers(): number {
    return this.users
  }
}

describe('Semaphore', () => {
  describe('not locked', () => {
    describe('without handler', () => {
      test('general', async () => {
        const semaphore = new TestSemaphore(2)
        await semaphore.acquire()

        const users1 = semaphore.getUsers()
        const release = await semaphore.acquire()
        const users2 = semaphore.getUsers()
        release()
        const users3 = semaphore.getUsers()

        expect(users1).toBe(1)
        expect(users2).toBe(2)
        expect(users3).toBe(1)
      })

      test('edge: reuse release', async () => {
        const semaphore = new TestSemaphore(2)
        await semaphore.acquire()

        const users1 = semaphore.getUsers()
        const release = await semaphore.acquire()
        const users2 = semaphore.getUsers()
        release()
        const users3 = semaphore.getUsers()
        release()
        const users4 = semaphore.getUsers()

        expect(users1).toBe(1)
        expect(users2).toBe(2)
        expect(users3).toBe(1)
        expect(users4).toBe(1)
      })
    })

    describe('with handler', () => {
      test('return value', async () => {
        const semaphore = new TestSemaphore(2)
        const fn = vi.fn(() => {
          expect(semaphore.getUsers()).toBe(2)
          return true
        })
        await semaphore.acquire()

        const users1 = semaphore.getUsers()
        const result = await semaphore.acquire(fn)
        const users2 = semaphore.getUsers()

        expect(fn).toBeCalledTimes(1)
        expect(result).toBe(true)
        expect(users1).toBe(1)
        expect(users2).toBe(1)
      })

      test('throw error', async () => {
        const customError = new Error('custom error')
        const semaphore = new TestSemaphore(2)
        const fn = vi.fn(() => {
          expect(semaphore.getUsers()).toBe(2)
          throw customError
        })
        await semaphore.acquire()

        const users1 = semaphore.getUsers()
        const err = await getErrorPromise(semaphore.acquire(fn))
        const users2 = semaphore.getUsers()
        // 证明出错后仍能够再次获取锁.
        await semaphore.acquire(() => {
          expect(semaphore.getUsers()).toBe(2)
        })
        const users3 = semaphore.getUsers()

        expect(fn).toBeCalledTimes(1)
        expect(err).toBe(customError)
        expect(users1).toBe(1)
        expect(users2).toBe(1)
        expect(users3).toBe(1)
      })
    })
  })

  describe('locked', () => {
    describe('without handler', () => {
      test('general', async () => {
        const semaphore = new TestSemaphore(2)
        await semaphore.acquire()
        const release = await semaphore.acquire()

        const startTime = Date.now()
        const users1 = semaphore.getUsers()
        setTimeout(release, 1000)
        await semaphore.acquire()
        const endTime = Date.now()
        const users2 = semaphore.getUsers()

        expect(users1).toBe(2)
        expect(users2).toBe(2)
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      })

      test('edge: reuse release', async () => {
        const semaphore = new TestSemaphore(2)
        const release = await semaphore.acquire()
        await semaphore.acquire()

        const users1 = semaphore.getUsers()
        setTimeout(release, 1000)
        await semaphore.acquire()
        const users2 = semaphore.getUsers()
        release()
        const users3 = semaphore.getUsers()

        expect(users1).toBe(2)
        expect(users2).toBe(2)
        expect(users3).toBe(2)
      })
    })

    describe('with handler', () => {
      test('return value', async () => {
        const semaphore = new TestSemaphore(2)
        const release = await semaphore.acquire()
        await semaphore.acquire()
        const fn = vi.fn(() => {
          expect(semaphore.getUsers()).toBe(2)
          return true
        })

        const startTime = Date.now()
        const users1 = semaphore.getUsers()
        setTimeout(release, 1000)
        const result = await semaphore.acquire(fn)
        const endTime = Date.now()
        const users2 = semaphore.getUsers()

        expect(result).toBe(true)
        expect(users1).toBe(2)
        expect(users2).toBe(1)
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      })

      test('throw error', async () => {
        const semaphore = new TestSemaphore(2)
        const release = await semaphore.acquire()
        await semaphore.acquire()
        const customError = new Error('custom error')
        const fn = vi.fn(() => {
          expect(semaphore.getUsers()).toBe(2)
          throw customError
        })

        const startTime = Date.now()
        const users1 = semaphore.getUsers()
        setTimeout(release, 1000)
        const err = await getErrorPromise(semaphore.acquire(fn))
        const endTime = Date.now()
        const users2 = semaphore.getUsers()
        // 证明出错后仍能够再次获取锁.
        await semaphore.acquire(() => {
          expect(semaphore.getUsers()).toBe(2)
        })
        const users3 = semaphore.getUsers()

        expect(err).toBe(customError)
        expect(users1).toBe(2)
        expect(users2).toBe(1)
        expect(users3).toBe(1)
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      })
    })
  })
})
