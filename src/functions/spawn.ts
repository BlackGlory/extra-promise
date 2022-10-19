import { each } from './each'
import { countup } from 'extra-generator'

export async function spawn(
  num: number
, task: (id: number) => PromiseLike<void>
): Promise<void> {
  await each(countup(1, num), val => task(val))
}
