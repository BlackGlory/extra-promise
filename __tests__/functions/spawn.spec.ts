import { spawn } from '@functions/spawn'
import { delay } from '@functions/delay'
import { TIME_ERROR } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('spawn', () => {
  it('returns Promise<void>', async () => {
    const task = jest.fn(() => delay(500))

    const startTime = Date.now()
    const result = spawn(3, task)
    const proResult = await result
    const elapsed = Date.now() - startTime

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
    expect(elapsed).toBeWithin(500 - TIME_ERROR, 1000)
    expect(task).toBeCalledTimes(3)
    expect(task).nthCalledWith(1, 1)
    expect(task).nthCalledWith(2, 2)
    expect(task).nthCalledWith(3, 3)
  })
})
