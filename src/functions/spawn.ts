import { each } from './each'
import { repeat } from 'extra-generator'

export async function spawn(num: number, task: () => Promise<void>): Promise<void> {
  await each(repeat(null, num), () => task())
}
