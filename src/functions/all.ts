import { UnpackedPromiseLike } from 'hotypes'
import { fromEntries, pipeAsync } from 'extra-utils'
import { map } from './map.js'

export function all<T extends { [key: string]: PromiseLike<unknown> }>(
  keyToPromise: T
): Promise<{ [Key in keyof T]: UnpackedPromiseLike<T[Key]> }> {
  return pipeAsync(
    Object.entries(keyToPromise)
  , entries => map(entries, async ([key, value]) => [key, await value])
  , fromEntries
  )
}
