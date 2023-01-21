import { map } from './map.js'
import { countup } from 'extra-generator'
import { Awaitable } from 'justypes'

export async function spawn<T>(
  num: number
, create: (id: number) => Awaitable<T>
): Promise<T[]> {
  return await map(countup(1, num), id => create(id))
}
