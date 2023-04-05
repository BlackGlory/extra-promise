import { DeferredGroup } from '@classes/deferred-group.js'
import { IDeferred } from '@utils/types.js'

describe('DeferredGroup', () => {
  test('add', () => {
    const deferred = createDeferred()
    const group = new DeferredGroup()
    group.add(deferred)

    group.add(deferred)
    group.resolve(undefined)

    expect(deferred.resolve).toBeCalledTimes(1)
    expect(deferred.reject).not.toBeCalled()
  })

  test('remove', () => {
    const deferred = createDeferred()
    const group = new DeferredGroup()
    group.add(deferred)

    group.remove(deferred)
    group.resolve(undefined)

    expect(deferred.resolve).not.toBeCalled()
    expect(deferred.reject).not.toBeCalled()
  })

  test('clear', () => {
    const deferred = createDeferred()
    const group = new DeferredGroup()
    group.add(deferred)

    group.clear()
    group.resolve(undefined)

    expect(deferred.resolve).not.toBeCalled()
    expect(deferred.reject).not.toBeCalled()
  })

  test('resolve', () => {
    const deferred = createDeferred<number>()
    const group = new DeferredGroup<number>()
    group.add(deferred)

    group.resolve(1)

    expect(deferred.resolve).toBeCalledTimes(1)
    expect(deferred.resolve).toBeCalledWith(1)
    expect(deferred.reject).not.toBeCalled()
  })

  test('reject', () => {
    const deferred = createDeferred<number>()
    const group = new DeferredGroup<number>()
    group.add(deferred)

    group.reject(1)

    expect(deferred.reject).toBeCalledTimes(1)
    expect(deferred.reject).toBeCalledWith(1)
    expect(deferred.resolve).not.toBeCalled()
  })
})

function createDeferred<T>(): IDeferred<T> {
  return {
    resolve: vi.fn()
  , reject: vi.fn()
  }
}
