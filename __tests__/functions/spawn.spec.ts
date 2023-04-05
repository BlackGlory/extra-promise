import { spawn } from '@functions/spawn.js'
import { delay } from '@functions/delay.js'
import { TIME_ERROR } from '@test/utils.js'

describe('spawn', () => {
  it('returns Promise<T>', async () => {
    const create = vi.fn(async id => {
      await delay(500)
      return id
    })

    const startTime = Date.now()
    const result = await spawn(3, create)
    const elapsed = Date.now() - startTime

    expect(result).toStrictEqual([1, 2, 3])
    expect(elapsed).toBeGreaterThanOrEqual(500 - TIME_ERROR)
    expect(elapsed).toBeLessThan(1000)
    expect(create).toBeCalledTimes(3)
    expect(create).nthCalledWith(1, 1)
    expect(create).nthCalledWith(2, 2)
    expect(create).nthCalledWith(3, 3)
  })
})
