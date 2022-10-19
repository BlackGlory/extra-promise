import { FiniteStateMachine } from 'extra-fsm'

export enum StatefulPromiseState {
  Pending = 'pending'
, Fulfilled = 'fulfilled'
, Rejected = 'rejected'
}

type Event = 'resolve' | 'reject'

export class StatefulPromise<T> extends Promise<T> {
  static from<T>(promise: PromiseLike<T>): StatefulPromise<T> {
    return new StatefulPromise(async (resolve, reject) => {
      try {
        resolve(await promise)
      } catch (e) {
        reject(e)
      }
    })
  }

  private fsm: FiniteStateMachine<StatefulPromiseState, Event>

  get state(): StatefulPromiseState {
    return this.fsm.state
  }

  constructor(
    executor: (
      resolve: (value: T) => void
    , reject: (reason: any) => void
    ) => void
  ) {
    const fsm = new FiniteStateMachine<StatefulPromiseState, Event>({
      [StatefulPromiseState.Pending]: {
        resolve: StatefulPromiseState.Fulfilled
      , reject: StatefulPromiseState.Rejected
      }
    , [StatefulPromiseState.Fulfilled]: {}
    , [StatefulPromiseState.Rejected]: {}
    }, StatefulPromiseState.Pending)

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

  isPending(): boolean {
    return this.fsm.matches(StatefulPromiseState.Pending)
  }

  isFulfilled(): boolean {
    return this.fsm.matches(StatefulPromiseState.Fulfilled)
  }

  isRejected(): boolean {
    return this.fsm.matches(StatefulPromiseState.Rejected)
  }
}
