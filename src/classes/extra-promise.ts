import { FiniteStateMachine } from '@blackglory/structures'

enum State {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

type Event = 'resolve' | 'reject'

export class ExtraPromise<T> extends Promise<T> {
  private fsm: FiniteStateMachine<State, Event>

  get pending() {
    return this.fsm.matches(State.Pending)
  }

  get fulfilled() {
    return this.fsm.matches(State.Fulfilled)
  }

  get rejected() {
    return this.fsm.matches(State.Rejected)
  }

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const fsm = new FiniteStateMachine<State, Event>({
      [State.Pending]: {
        resolve: State.Fulfilled
      , reject: State.Rejected
      }
    , [State.Fulfilled]: {}
    , [State.Rejected]: {}
    }, State.Pending)

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
