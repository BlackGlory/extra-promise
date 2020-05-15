import { debounceMicrotask, cancelMicrotask } from '@src/shared/debounce-microtask'

describe('debounceMicrotask(fn: () => void): void', () => {
  it('fn called once', async () => {
    const fn = jest.fn()

    debounceMicrotask(fn)
    debounceMicrotask(fn)
    await Promise.resolve()

    expect(fn).toBeCalledTimes(1)
  })
})

describe('cancelMicrotask(fn: () => void): void', () => {
  it('fn not called', async () => {
    const fn = jest.fn()

    debounceMicrotask(fn)
    debounceMicrotask(fn)
    cancelMicrotask(fn)
    await Promise.resolve()

    expect(fn).not.toBeCalled()
  })
})
