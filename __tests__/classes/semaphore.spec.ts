import { Semaphore } from '@classes/semaphore'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import 'jest-extended'
import '@blackglory/jest-matchers'

describe('Semaphore', () => {
  describe('not locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const semaphore = new Semaphore(1)

      const result = semaphore.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
    })

    describe('acquire(handler: () => void | Promise<void>): Promise<void>', () => {
      test('handler', done => {
        const semaphore = new Semaphore(1)

        semaphore.acquire(done)
      })

      test('return value', async () => {
        const semaphore = new Semaphore(1)

        const result = semaphore.acquire(() => {})
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })
  })

  describe('locked', () => {
    it('acquire(): Promise<Release>', async () => {
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

    describe('acquire(handler: () => void | Promise<void>): Promise<void>', () => {
      test('handler', done => {
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

    test('return value', async () => {
      const semaphore = new Semaphore(2)
      const release = await semaphore.acquire()

      const start = now()
      setTimeout(release, 1000)
      const result1 = semaphore.acquire(() => sleep(500))
      const result2 = semaphore.acquire(() => sleep(500))
      const proResult1 = await result1
      const result1ResolvedTime = now()
      const proResult2 = await result2
      const result2ResolvedTime = now()

      expect(result1).toBePromise()
      expect(result2).toBePromise()
      expect(proResult1).toBeUndefined()
      expect(proResult2).toBeUndefined()
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
