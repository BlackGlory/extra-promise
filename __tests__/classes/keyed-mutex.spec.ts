import { KeyedMutex } from '@classes/keyed-mutex.js'
import { TIME_ERROR } from '@test/utils.js'
import { getErrorPromise } from 'return-style'

class TestKeyedMutex<T, U> extends KeyedMutex<T, U> {
  getLocks(): number {
    return this.keyToUnlockDeferred.size
  }

  isLocked(val: T): boolean {
    const key = this.createKey(val)
    return this.keyToUnlockDeferred.has(key)
  }
}

function createKey(num: number): string {
  return num.toString()
}

describe('KeyedMutex', () => {
  describe('acquire', () => {
    describe('not locked', () => {
      test('without handler', async () => {
        const mutex = new TestKeyedMutex(createKey)
        await mutex.acquire(0)

        const locks1 = mutex.getLocks()
        const release = await mutex.acquire(1)
        const locks2 = mutex.getLocks()
        const isLocked1 = mutex.isLocked(1)
        release()
        const locks3 = mutex.getLocks()
        const isLocked2 = mutex.isLocked(1)

        expect(isLocked1).toBe(true)
        expect(isLocked2).toBe(false)
        expect(locks1).toBe(1)
        expect(locks2).toBe(2)
        expect(locks3).toBe(1)
      })

      describe('with handler', () => {
        test('return value', async () => {
          const mutex = new TestKeyedMutex(createKey)
          const fn = vi.fn(() => {
            expect(mutex.isLocked(1)).toBe(true)
            expect(mutex.getLocks()).toBe(2)
            return true
          })
          await mutex.acquire(0)

          const locks1 = mutex.getLocks()
          const result = await mutex.acquire(1, fn)
          const locks2 = mutex.getLocks()
          const isLocked = mutex.isLocked(1)

          expect(fn).toBeCalledTimes(1)
          expect(result).toBe(true)
          expect(isLocked).toBe(false)
          expect(locks1).toBe(1)
          expect(locks2).toBe(1)
        })

        test('throw error', async () => {
          const customError = new Error('custom error')
          const mutex = new TestKeyedMutex(createKey)
          const fn = vi.fn(() => {
            expect(mutex.isLocked(1)).toBe(true)
            throw customError
          })
          await mutex.acquire(0)

          const locks1 = mutex.getLocks()
          const err = await getErrorPromise(mutex.acquire(1, fn))
          const locks2 = mutex.getLocks()
          const isLocked1 = mutex.isLocked(1)
          await mutex.acquire(1) // 出错后仍能够再次获取锁.
          const locks3 = mutex.getLocks()
          const isLocked2 = mutex.isLocked(1)

          expect(fn).toBeCalledTimes(1)
          expect(err).toBe(customError)
          expect(locks1).toBe(1)
          expect(locks2).toBe(1)
          expect(locks3).toBe(2)
          expect(isLocked1).toBe(false)
          expect(isLocked2).toBe(true)
        })
      })
    })

    describe('locked', () => {
      describe('without handler', () => {
        test('general', async () => {
          const mutex = new TestKeyedMutex(createKey)
          const release1 = await mutex.acquire(1)

          const startTime = Date.now()
          setTimeout(release1, 1000)
          const isLocked1 = mutex.isLocked(1)
          const release2 = await mutex.acquire(1)
          const isLocked2 = mutex.isLocked(1)
          release2()
          const isLocked3 = mutex.isLocked(1)

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(true)
          expect(isLocked3).toBe(false)
        })

        test('edge: reuse release', async () => {
          const mutex = new TestKeyedMutex(createKey)
          const release = await mutex.acquire(1)

          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked(1)
          await mutex.acquire(1)
          const isLocked2 = mutex.isLocked(1)
          release()
          const isLocked3 = mutex.isLocked(1)

          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(true)
          expect(isLocked3).toBe(true)
        })
      })

      describe('with handler', () => {
        test('return value', async () => {
          const mutex = new TestKeyedMutex(createKey)
          const release = await mutex.acquire(1)
          const fn = vi.fn(() => {
            expect(mutex.isLocked(1)).toBe(true)
            return true
          })

          const startTime = Date.now()
          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked(1)
          const result = await mutex.acquire(1, fn)
          const isLocked2 = mutex.isLocked(1)

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(result).toBe(true)
          expect(isLocked1).toBe(true)
          expect(isLocked2).toBe(false)
        })

        test('throw error', async () => {
          const customError = new Error('custom error')
          const mutex = new TestKeyedMutex(createKey)
          const release = await mutex.acquire(1)
          const fn = vi.fn(() => {
            expect(mutex.isLocked(1)).toBe(true)
            throw customError
          })

          const startTime = Date.now()
          setTimeout(release, 1000)
          const isLocked1 = mutex.isLocked(1)
          const err = await getErrorPromise(mutex.acquire(1, fn))
          const isLocked2 = mutex.isLocked(1)
          await mutex.acquire(1) // 出错后仍能够再次获取锁.
          const isLocked3 = mutex.isLocked(1)

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
