import { Semaphore } from '@classes/semaphore'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import { getErrorPromise } from 'return-style'
import 'jest-extended'
import '@blackglory/jest-matchers'
import { pass } from '@blackglory/pass'

describe('Semaphore', () => {
  describe('not locked', () => {
    it('without handler', async () => {
      const semaphore = new Semaphore(1)

      const result = semaphore.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
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

        const result = semaphore.acquire(() => true)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBe(true)
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
      const result1 = semaphore.acquire(async () => {
        await sleep(500)
        return 1
      })
      const result2 = semaphore.acquire(async () => {
        await sleep(500)
        return 2
      })
      const proResult1 = await result1
      const result1ResolvedTime = now()
      const proResult2 = await result2
      const result2ResolvedTime = now()

      expect(result1).toBePromise()
      expect(result2).toBePromise()
      expect(proResult1).toBe(1)
      expect(proResult2).toBe(2)
      expect(result1ResolvedTime - start).toBeGreaterThanOrEqual(500 - TIME_ERROR)
      expect(result1ResolvedTime - start).toBeLessThan(1000 - TIME_ERROR)
      expect(result2ResolvedTime - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })
  })
})

function now() {
  return Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
