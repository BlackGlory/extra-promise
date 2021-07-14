import { Mutex } from '@classes/mutex'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import 'jest-extended'
import '@blackglory/jest-matchers'

describe('Mutex', () => {
  describe('not locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const mutex = new Mutex()

      const result = mutex.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
    })

    describe('acquire(handler: () => void | Promise<void>): Promise<void>', () => {
      test('handler', done => {
        const mutex = new Mutex()

        mutex.acquire(done)
      })

      test('return value', async () => {
        const mutex = new Mutex()

        const result = mutex.acquire(() => {})
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })
  })

  describe('locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const mutex = new Mutex()
      const release = await mutex.acquire()

      const start = now()
      setTimeout(release, 1000)
      await mutex.acquire()

      expect(now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    })

    describe('acquire(handler: (release: Release) => void): Promise<void>', () => {
      test('handler', done => {
        go(async () => {
          const mutex = new Mutex()
          const release = await mutex.acquire()

          const start = now()
          setTimeout(release, 1000)
          mutex.acquire(() => {
            expect(now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
            done()
          })
        })
      })

      test('return value', async () => {
        const mutex = new Mutex()
        const release = await mutex.acquire()

        const start = now()
        setTimeout(release, 1000)
        const result = mutex.acquire(() => sleep(500))
        const proResult = await result

        expect(now() - start).toBeGreaterThanOrEqual(1500 - TIME_ERROR)
        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
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
