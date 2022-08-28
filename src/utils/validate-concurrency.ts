import { assert } from '@blackglory/errors'

export function validateConcurrency(name: string, value: number): void {
  assert(value === Infinity || Number.isInteger(value), `The parameter ${name} must be an integer`)
  assert(value >= 1, `The parameter ${name} must be greater than or equal to 1`)
}
