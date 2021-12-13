import { createMachine, interpret } from 'xstate'

enum State {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

type Event =
| { type: 'DONE' }
| { type: 'ERROR' }

const machine = createMachine<{}, Event>({
  strict: true
, initial: State.Pending
, states: {
    [State.Pending]: {
      on: {
        DONE: { target: State.Fulfilled }
      , ERROR: { target: State.Rejected }
      }
    }
  , [State.Fulfilled]: { type: 'final' }
  , [State.Rejected]: { type: 'final' }
  }
})

export class ExtraPromise<T> extends Promise<T> {
  private fsm

  get pending() {
    return this.fsm.state.matches(State.Pending)
  }

  get fulfilled() {
    return this.fsm.state.matches(State.Fulfilled)
  }

  get rejected() {
    return this.fsm.state.matches(State.Rejected)
  }

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const fsm = interpret(machine).start()
  
    super((resolve, reject) => {
      executor(
        value => {
          fsm.send('DONE')
          resolve(value)
        }
      , reason => {
          fsm.send('ERROR')
          reject(reason)
        }
      )
    })

    this.fsm = fsm
  }
}
