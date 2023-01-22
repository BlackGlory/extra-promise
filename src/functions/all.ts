import { UnpackedPromiseLike } from 'hotypes'
import { map } from './map.js'
import { go } from '@blackglory/go'
import { fromPairs } from 'lodash-es'

export function all<T extends { [key: string]: PromiseLike<unknown> }>(
  obj: T
): Promise<{ [Key in keyof T]: UnpackedPromiseLike<T[Key]> }> {
  return go(async () => {
    const entries = Object.entries(obj)
    const results = await map(
      entries
    , async ([key, value]) => [key, await value]
    )

    return fromPairs(results) as {
      [Key in keyof T]: UnpackedPromiseLike<T[Key]>
    }
  })
}
