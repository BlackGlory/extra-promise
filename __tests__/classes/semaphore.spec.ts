import { Semaphore } from '@classes/semaphore.js'
import { TIME_ERROR } from '@test/utils.js'
import { go } from '@blackglory/go'
import { getErrorPromise } from 'return-style'
import { pass } from '@blackglory/pass'
import { assert } from '@blackglory/errors'
import { isFunction } from 'extra-utils'

describe('Semaphore', () => {
  describe('not locked', () => {
    it('without handler', async () => {
      const semaphore = new Semaphore(1)

      const result = await semaphore.acquire()

      assert(isFunction(result), 'result is not a function')
    })

    describe('with handler', () => {
      it('calls handler', done => {
        const semaphore = new Semaphore(1)

        semaphore.acquire(done)
      })

      it('throws error', async () => {
        const customError = new Error('custom error')
        const semaphore = new Semaphore(1)

        const err = await getErrorPromise(semaphore.acquire(() => {
          throw customError
        }))
        await semaphore.acquire(pass)

        expect(err).toBe(customError)
      })

      it('returns value', async () => {
        const semaphore = new Semaphore(1)

        const result = await semaphore.acquire(() => true)

        expect(result).toBe(true)
      })
    })
  })

  describe('locked', () => {
    it('without handler', async () => {
      const semaphore = new Semaphore(2)

      const release = await semaphore.acquire()
      const time1 = now()
      await semaphore.acquire()
      const time2 = now()
      setTimeout(release, 1000)
      await semaphore.acquire()
      const time3 = now()

      expect(time3 - time1).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(time3 - time2).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    describe('with handler', () => {
      it('calls handler', done => {
        go(async () => {
          const semaphore = new Semaphore(2)

          let time1: number
            , time2: number
            , time3: number
          semaphore.acquire(async () => {
            time1 = now()
            await sleep(1000)
          })
          semaphore.acquire(async () => {
            time2 = now()
            await sleep(1000)
          })
          semaphore.acquire(async () => {
            time3 = now()
            expect(time3 - time1).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
            expect(time3 - time2).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
            done()
          })
        })
      })
    })

    it('returns value', async () => {
      const semaphore = new Semaphore(2)
      const release = await semaphore.acquire()

      const start = now()
      setTimeout(release, 1000)
      const promise1 = semaphore.acquire(async () => {
        await sleep(500)
        return 1
      })
      const promise2 = semaphore.acquire(async () => {
        await sleep(500)
        return 2
      })
      const result1 = await promise1
      const promise1ResolvedTime = now()
      const result2 = await promise2
      const promise2ResolvedTime = now()

      expect(result1).toBe(1)
      expect(result2).toBe(2)
      expect(promise1ResolvedTime - start).toBeGreaterThanOrEqual(500 - TIME_ERROR)
      expect(promise1ResolvedTime - start).toBeLessThan(1000 - TIME_ERROR)
      expect(promise2ResolvedTime - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })
  })
})

function now() {
  return Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
