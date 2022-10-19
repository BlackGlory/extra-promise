import { waterfall } from '@functions/waterfall'
import { getErrorPromise } from 'return-style'
import '@blackglory/jest-matchers'
import { pass } from '@blackglory/pass'
import { go } from '@blackglory/go'

describe('waterfall', () => {
  describe('tasks is Iterable', () => {
    describe('tasks is empty', () => {
      it('returns Promise<undefined>', async () => {
        const result = waterfall([])
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })

    describe('resolve', () => {
      it('returns Promise<T>', async () => {
        const value1 = 'value1'
        const value2 = 'value2'
        const task1 = jest.fn().mockReturnValue(Promise.resolve(value1))
        const task2 = jest.fn().mockReturnValue(Promise.resolve(value2))

        const result = waterfall([task1, task2])
        const proResult = await result

        expect(result).toBePromise()
        expect(task1).toBeCalledTimes(1)
        expect(task1).toBeCalledWith(undefined)
        expect(task2).toBeCalledTimes(1)
        expect(task2).toBeCalledWith(value1)
        expect(proResult).toBe(value2)
      })
    })

    describe('reject', () => {
      it('returns rejected Promise', async () => {
        const error = new Error('CustomError')
        const value = 'value'
        const task1 = jest.fn().mockReturnValue(Promise.reject(error))
        const task2 = jest.fn().mockReturnValue(Promise.resolve(value))

        const result = waterfall([task1, task2])
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(task1).toBeCalledTimes(1)
        expect(task2).not.toBeCalled()
        expect(err).toBe(error)
      })
    })
  })

  describe('tasks is AsyncIterable', () => {
    describe('tasks is empty', () => {
      it('returns Promise<undefined>', async () => {
        const result = waterfall(go(async function* () {
          pass()
        }))
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeUndefined()
      })
    })

    describe('resolve', () => {
      it('returns Promise<T>', async () => {
        const value1 = 'value1'
        const value2 = 'value2'
        const task1 = jest.fn().mockReturnValue(Promise.resolve(value1))
        const task2 = jest.fn().mockReturnValue(Promise.resolve(value2))

        const result = waterfall(go(async function* () {
          yield task1
          yield task2
        }))
        const proResult = await result

        expect(result).toBePromise()
        expect(task1).toBeCalledTimes(1)
        expect(task1).toBeCalledWith(undefined)
        expect(task2).toBeCalledTimes(1)
        expect(task2).toBeCalledWith(value1)
        expect(proResult).toBe(value2)
      })
    })

    describe('reject', () => {
      it('returns rejected Promise', async () => {
        const error = new Error('CustomError')
        const value = 'value'
        const task1 = jest.fn().mockReturnValue(Promise.reject(error))
        const task2 = jest.fn().mockReturnValue(Promise.resolve(value))

        const result = waterfall(go(async function* () {
          yield task1
          yield task2
        }))
        const err = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(task1).toBeCalledTimes(1)
        expect(task2).not.toBeCalled()
        expect(err).toBe(error)
      })
    })
  })
})
