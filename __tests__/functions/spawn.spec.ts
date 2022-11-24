import { spawn } from '@functions/spawn'
import { delay } from '@functions/delay'
import { TIME_ERROR } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('spawn', () => {
  it('returns Promise<T>', async () => {
    const create = jest.fn(async id => {
      await delay(500)
      return id
    })

    const startTime = Date.now()
    const result = spawn(3, create)
    const proResult = await result
    const elapsed = Date.now() - startTime

    expect(result).toBePromise()
    expect(proResult).toStrictEqual([1, 2, 3])
    expect(elapsed).toBeWithin(500 - TIME_ERROR, 1000)
    expect(create).toBeCalledTimes(3)
    expect(create).nthCalledWith(1, 1)
    expect(create).nthCalledWith(2, 2)
    expect(create).nthCalledWith(3, 3)
  })
})
