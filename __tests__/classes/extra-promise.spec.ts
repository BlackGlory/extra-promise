import { ExtraPromise } from '@classes/extra-promise'
import { getErrorPromise } from 'return-style'

describe('ExtraPromise', () => {
  test('fulfilled', async () => {
    const value = 'value'

    const result = new ExtraPromise(resolve => setImmediate(() => resolve(value)))

    expect(result).toBeInstanceOf(Promise)
    expect(result.pending).toBe(true)
    expect(result.fulfilled).toBe(false)
    expect(result.rejected).toBe(false)

    const proResult = await result

    expect(proResult).toBe(value)
    expect(result.pending).toBe(false)
    expect(result.fulfilled).toBe(true)
    expect(result.rejected).toBe(false)
  })

  test('rejected', async () => {
    const reason = new Error('reason')

    const result = new ExtraPromise((_, reject) => setImmediate(() => reject(reason)))

    expect(result).toBeInstanceOf(Promise)
    expect(result.pending).toBe(true)
    expect(result.fulfilled).toBe(false)
    expect(result.rejected).toBe(false)

    const err = await getErrorPromise(result)

    expect(err).toBe(reason)
    expect(result.pending).toBe(false)
    expect(result.fulfilled).toBe(false)
    expect(result.rejected).toBe(true)
  })
})
