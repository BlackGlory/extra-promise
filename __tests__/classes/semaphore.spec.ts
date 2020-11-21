import { Semaphore } from '@classes/semaphore'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('Semaphore', () => {
  describe('not locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const semaphore = new Semaphore(1)

      const result = semaphore.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
    })

    it('acquire(handler: () => void | Promise<void>): void', async done => {
      const semaphore = new Semaphore(1)

      const result = semaphore.acquire(done)

      expect(result).toBeUndefined()
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

      expect(time3 - time1).toBeGreaterThanOrEqual(1000)
      expect(time3 - time2).toBeGreaterThanOrEqual(1000)
    })

    it('acquire(handler: () => void | Promise<void>): void', async done => {
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
        expect(time3 - time1).toBeGreaterThanOrEqual(1000)
        expect(time3 - time2).toBeGreaterThanOrEqual(1000)
        done()
      })
    })
  })
})

function now() {
  return Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
