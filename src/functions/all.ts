import { UnpackedPromiseLike } from 'hotypes'
import { map } from './map.js'

export async function all<T extends { [key: string]: PromiseLike<unknown> }>(
  obj: T
): Promise<{ [Key in keyof T]: UnpackedPromiseLike<T[Key]> }> {
  const entries = Object.entries(obj)
  const results = await map(
    entries
  , async ([key, value]) => [key, await value] as const
  )

  return Object.fromEntries(results) as {
    [Key in keyof T]: UnpackedPromiseLike<T[Key]>
  }
}
