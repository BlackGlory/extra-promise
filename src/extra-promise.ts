'use strict'

import { chain } from './fn/chain'
import { delay } from './fn/delay'
import { each } from './fn/each'
import { fix } from './fn/fix'
import { isPromise } from './fn/is-promise'
import { map } from './fn/map'
import { promisify } from './fn/promisify'
import { retry } from './fn/retry'
import { silent } from './fn/silent'
import { sleep } from './fn/sleep'
import { warn } from './fn/warn'

export {
  chain
, delay
, each
, fix
, isPromise
, map
, promisify
, retry
, silent
, sleep
, warn
}

export const extraPromise = {
  chain
, delay
, each
, fix
, isPromise
, map
, promisify
, retry
, silent
, sleep
, warn
}

export default extraPromise
