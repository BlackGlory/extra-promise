import { ExtraPromise } from '@classes/extra-promise'
import { toExtraPromise } from '@functions/to-extra-promise'

describe('toExtraPromise<T>(promise: PromiseLike<T>): ExtraPromise<T>', () => {
  it('return ExtraPromise', async () => {
    const value = 'value'
    const promise = Promise.resolve(value)

    const result = toExtraPromise(promise)
    const proResult = await result

    expect(result).toBeInstanceOf(ExtraPromise)
    expect(proResult).toBe(value)
  })
})
