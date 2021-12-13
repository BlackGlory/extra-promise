import { Box } from '@blackglory/structures'

enum State {
  Pending
, Fulfilled
, Rejected
}

export class ExtraPromise<T> extends Promise<T> {
  private state: Box<State>

  get pending() {
    return this.state.get() === State.Pending
  }

  get fulfilled() {
    return this.state.get() === State.Fulfilled
  }

  get rejected() {
    return this.state.get() === State.Rejected
  }

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const state = new Box(State.Pending)

    super((resolve, reject) => {
      executor(
        value => {
          if (state.get() === State.Pending) {
            state.set(State.Fulfilled)
            resolve(value)
          }
        }
      , reason => {
          if (state.get() === State.Pending) {
            state.set(State.Rejected)
            reject(reason)
          }
        }
      )
    })

    this.state = state
  }
}
