import { Semaphore } from './semaphore.js'

export class Mutex extends Semaphore {
  constructor() {
    super(1)
  }
}
