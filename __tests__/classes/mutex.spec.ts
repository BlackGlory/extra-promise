import { Mutex } from '@classes/mutex.js'
import { delay } from '@functions/delay.js'
import { TIME_ERROR } from '@test/utils.js'
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
        it('calls handler', async () => {
          const mutex = new Mutex()

          await new Promise<void>(resolve => mutex.acquire(resolve))
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

        const startTime = Date.now()
        setTimeout(release, 1000)
        await mutex.acquire()

        const elapsedTime = Date.now() - startTime
        expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      })

      describe('with handler', () => {
        it('calls handler', async () => {
          const mutex = new Mutex()
          const release = await mutex.acquire()

          const startTime = Date.now()
          setTimeout(release, 1000)
          await new Promise<void>(resolve => mutex.acquire(resolve))

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        })

        it('returns value', async () => {
          const mutex = new Mutex()
          const release = await mutex.acquire()

          const startTime = Date.now()
          setTimeout(release, 1000)
          const result = await mutex.acquire(async () => {
            await delay(500)
            return true
          })

          const elapsedTime = Date.now() - startTime
          expect(elapsedTime).toBeGreaterThanOrEqual(1500 - TIME_ERROR)
          expect(result).toBe(true)
        })
      })
    })
  })
})
