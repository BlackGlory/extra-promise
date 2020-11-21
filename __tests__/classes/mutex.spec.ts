import { Mutex } from '@classes/mutex'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('Mutex', () => {
  describe('not locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const mutex = new Mutex()

      const result = mutex.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
    })

    it('acquire(handler: () => void | Promise<void>): void', async done => {
      const mutex = new Mutex()

      const result = mutex.acquire(done)

      expect(result).toBeUndefined()
    })
  })

  describe('locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const mutex = new Mutex()
      const release = await mutex.acquire()

      const start = now()
      setTimeout(release, 1000)
      await mutex.acquire()

      expect(now() - start).toBeGreaterThanOrEqual(1000)
    })

    it('acquire(handler: (release: Release) => void): void', async done => {
      const mutex = new Mutex()
      const release = await mutex.acquire()

      const start = now()
      setTimeout(release, 1000)
      mutex.acquire(() => {
        expect(now() - start).toBeGreaterThanOrEqual(1000)
        done()
      })
    })
  })
})

function now() {
  return Date.now()
}
