enum Flag {
  Pending
, Fulfilled
, Rejected
}

export class ExtraPromise<T> extends Promise<T> {
  private states: [boolean, boolean, boolean]

  get pending() {
    return this.states[Flag.Pending]
  }

  get fulfilled() {
    return this.states[Flag.Fulfilled]
  }

  get rejected() {
    return this.states[Flag.Rejected]
  }

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    const states: [boolean, boolean, boolean] = [true, false, false]

    super((resolve, reject) => {
      executor(
        value => {
          if (states[Flag.Pending]) {
            states[Flag.Pending] = false
            states[Flag.Fulfilled] = true
            resolve(value)
          }
        }
      , reason => {
          if (states[Flag.Pending]) {
            states[Flag.Pending] = false
            states[Flag.Rejected] = true
            reject(reason)
          }
        }
      )
    })

    this.states = states
  }
}
