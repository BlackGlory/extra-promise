import { Mutex } from '@classes/mutex'
import { TIME_ERROR } from '@test/utils'
import { go } from '@blackglory/go'
import { getErrorPromise } from 'return-style'
import { pass } from '@blackglory/pass'
import { isFunction } from 'extra-utils'
import { assert } from '@blackglory/errors'

describe('Mutex', () => {
  describe('acquire', () => {
    describe('not locked', () => {
      it('without handler', async () => {
        const mutex = new Mutex()

        const result = await mutex.acquire()

        assert(isFunction(result), 'result is not a function')
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

          const result = await mutex.acquire(() => true)

          expect(result).toBe(true)
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
          const result = await mutex.acquire(async () => {
            await sleep(500)
            return true
          })

          expect(now() - start).toBeGreaterThanOrEqual(1500 - TIME_ERROR)
          expect(result).toBe(true)
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
