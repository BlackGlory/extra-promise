import { Mutex } from '@classes/mutex'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import { getErrorPromise } from 'return-style'
import 'jest-extended'
import '@blackglory/jest-matchers'
import { pass } from '@blackglory/pass'

describe('Mutex', () => {
  describe('not locked', () => {
    it('acquire(): Promise<Release>', async () => {
      const mutex = new Mutex()

      const result = mutex.acquire()
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeFunction()
    })

    describe('acquire<T>(handler: () => T | PromiseLike<T>): Promise<T>', () => {
      test('handler', done => {
        const mutex = new Mutex()

        mutex.acquire(done)
      })

      test('throw error', async () => {
        const customError = new Error('custom error')
        const mutex = new Mutex()

        const err = await getErrorPromise(mutex.acquire(() => {
          throw customError
        }))
        await mutex.acquire(pass)

        expect(err).toBe(customError)
      })

      test('return value', async () => {
        const mutex = new Mutex()

        const result = mutex.acquire(() => true)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBe(true)
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

    describe('acquire(handler: () => T | PromiseLike<T>): Promise<T>', () => {
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
        const result = mutex.acquire(async () => {
          await sleep(500)
          return true
        })
        const proResult = await result

        expect(now() - start).toBeGreaterThanOrEqual(1500 - TIME_ERROR)
        expect(result).toBePromise()
        expect(proResult).toBe(true)
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
