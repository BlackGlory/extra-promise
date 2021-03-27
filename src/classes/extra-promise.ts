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

class Box<T> {
  #value: T

  constructor(value: T) {
    this.#value = value
  }

  set(value: T) {
    this.#value = value
  }

  get() {
    return this.#value
  }
}
