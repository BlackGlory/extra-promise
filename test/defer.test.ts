import { defer } from '../src/defer'

test('[ArrayResult]defer resolve', async () => {
  const [promise, resolve] = defer()
  setTimeout(() => resolve('Room'), 1000)
  await expect(promise).resolves.toEqual('Room')
})

test('[ArrayResult]defer reject', async () => {
  const [promise, , reject] = defer()
  setTimeout(() => reject('Oh, Hi Mark!'), 1000)
  await expect(promise).rejects.toEqual('Oh, Hi Mark!')
})

test('[ObjectResult]defer resolve', async () => {
  const { promise, resolve } = defer()
  setTimeout(() => resolve('Room'), 1000)
  await expect(promise).resolves.toEqual('Room')
})

test('[ObjectResult]defer reject', async () => {
  const { promise, reject } = defer()
  setTimeout(() => reject('Oh, Hi Mark!'), 1000)
  await expect(promise).rejects.toEqual('Oh, Hi Mark!')
})
