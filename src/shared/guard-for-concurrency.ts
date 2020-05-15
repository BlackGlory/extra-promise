import { InvalidArgumentError } from '@error'

export function guardForConcurrency(name: string, value: number) {
  if (value < 1) throw new InvalidArgumentError(name, '>= 1')
  if (Number.isFinite(value) && !Number.isInteger(value)) {
    throw new InvalidArgumentError(name, 'an integer')
  }
}

export { InvalidArgumentError }
