import { ExtraPromise } from '@classes/extra-promise'

export function delay(ms: number): ExtraPromise<void> {
  return new ExtraPromise<void>(resolve => setTimeout(resolve, ms))
}
