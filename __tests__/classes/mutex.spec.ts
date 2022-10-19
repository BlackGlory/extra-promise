import { Mutex } from '@classes/mutex'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import { getErrorPromise } from 'return-style'
import 'jest-extended'
import '@blackglory/jest-matchers'
import { pass } from '@blackglory/pass'

describe('Mutex', () => {
  describe('acquire', () => {
    describe('not locked', () => {
      it('without handler', async () => {
        const mutex = new Mutex()

        const result = mutex.acquire()
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFunction()
      })

      describe('with handler', () => {
        it('calls handler', done => {
          const mutex = new Mutex()

          mutex.acquire(done)
        })

        test('throws error', async () => {
          const customError = new Error('custom error')
          const mutex = new Mutex()

          const err = await getErrorPromise(mutex.acquire(() => {
            throw customError
          }))
          await mutex.acquire(pass)

          expect(err).toBe(customError)
        })

        test('returns value', async () => {
          const mutex = new Mutex()

          const result = mutex.acquire(() => true)
          const proResult = await result

          expect(result).toBePromise()
          expect(proResult).toBe(true)
        })
      })
    })

    describe('locked', () => {
      it('without handler', async () => {
        const mutex = new Mutex()
        const release = await mutex.acquire()

        const start = now()
        setTimeout(release, 1000)
        await mutex.acquire()

        expect(now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      })

      describe('with handler', () => {
        it('calls handler', done => {
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

        it('returns value', async () => {
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
})

function now() {
  return Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
