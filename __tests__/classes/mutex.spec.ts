import { Mutex } from '@classes/mutex.js'
import { TIME_ERROR } from '@test/utils.js'
import { getErrorPromise } from 'return-style'

class TestMutex extends Mutex {
  isLocked(): boolean {
    return super.isLocked()
  }
}

describe('Mutex', () => {
  describe('acquire', () => {
    describe('not locked', () => {
      test('without handler', async () => {
        const mutex = new TestMutex()

        const release = await mutex.acquire()
        const isLocked1 = mutex.isLocked()
        release()
        const isLocked2 = mutex.isLocked()

        expect(isLocked1).toBe(true)
        expect(isLocked2).toBe(false)
      })

      describe('with handler', () => {
        test('return value', async () => {
          const mutex = new TestMutex()
          const fn = vi.fn(() => {
            expect(mutex.isLocked()).toBe(true)
            return true
          })

          const result = await mutex.acquire(fn)

          expect(fn).toBeCalledTimes(1)
          expect(result).toBe(true)
          expect(mutex.isLocked()).toBe(false)
        })

        test('throw error', async () => {
          const customError = new Error('custom error')
          const mutex = new TestMutex()
          const fn = vi.fn(() => {
            expect(mutex.isLocked()).toBe(true)
            throw customError
          })

          const err = await getErrorPromise(mutex.acquire(fn))
          const isLocked1 = mutex.isLocked()
          await mutex.acquire() // 出错后仍能够再次获取锁.
          const isLocked2 = mutex.isLocked()

          expect(fn).toBeCalledTimes(1)
          expect(err).toBe(customError)
          expect(isLocked1).toBe(false)
          expect(isLocked2).toBe(true)
        })
      })
    })

    describe('locked', () => {
      describe('without handler', () => {
        test('general', async () => {
          const mutex = new TestMutex()
          const release1 = await mutex.acquire()

          const startTime = Date.now()
          setTimeout(release1, 1000)
          const isLocked1 = mutex.isLocked()
          const release2 = await mutex.acquire()
          const isLocked2 = mutex.isLocked()
          release2()
          const isLocked3 = mutex.isLocked()

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(true)
          expect(isLocked3).toBe(false)
        })

        test('edge: reuse release', async () => {
          const mutex = new TestMutex()
          const release = await mutex.acquire()

          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked()
          await mutex.acquire()
          const isLocked2 = mutex.isLocked()
          release()
          const isLocked3 = mutex.isLocked()

          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(true)
          expect(isLocked3).toBe(true)
        })
      })

      describe('with handler', () => {
        test('return value', async () => {
          const mutex = new TestMutex()
          const release = await mutex.acquire()
          const fn = vi.fn(() => {
            expect(mutex.isLocked()).toBe(true)
            return true
          })

          const startTime = Date.now()
          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked()
          const result = await mutex.acquire(fn)
          const isLocked2 = mutex.isLocked()

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(result).toBe(true)
          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(false)
        })

        test('throw error', async () => {
          const customError = new Error('custom error')
          const mutex = new TestMutex()
          const release = await mutex.acquire()
          const fn = vi.fn(() => {
            expect(mutex.isLocked()).toBe(true)
            throw customError
          })

          const startTime = Date.now()
          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked()
          const err = await getErrorPromise(mutex.acquire(fn))
          const isLocked2 = mutex.isLocked()
          await mutex.acquire() // 出错后仍能够再次获取锁.
          const isLocked3 = mutex.isLocked()

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(err).toBe(customError)
          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(false)
          expect(isLocked3).toBe(true)
        })
      })
    })
  })
})
