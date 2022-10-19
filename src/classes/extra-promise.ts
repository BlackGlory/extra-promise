import { FiniteStateMachine } from 'extra-fsm'

export enum ExtraPromiseState {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

type Event = 'resolve' | 'reject'

export class ExtraPromise<T> extends Promise<T> {
  private fsm: FiniteStateMachine<ExtraPromiseState, Event>

  get pending() {
    return this.fsm.matches(ExtraPromiseState.Pending)
  }

  get fulfilled() {
    return this.fsm.matches(ExtraPromiseState.Fulfilled)
  }

  get rejected() {
    return this.fsm.matches(ExtraPromiseState.Rejected)
  }

  get state(): ExtraPromiseState {
    return this.fsm.state
  }

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const fsm = new FiniteStateMachine<ExtraPromiseState, Event>({
      [ExtraPromiseState.Pending]: {
        resolve: ExtraPromiseState.Fulfilled
      , reject: ExtraPromiseState.Rejected
      }
    , [ExtraPromiseState.Fulfilled]: {}
    , [ExtraPromiseState.Rejected]: {}
    }, ExtraPromiseState.Pending)

    super((resolve, reject) => {
      executor(
        value => {
          fsm.send('resolve')
          resolve(value)
        }
      , reason => {
          fsm.send('reject')
          reject(reason)
        }
      )
    })

    this.fsm = fsm
  }
}
