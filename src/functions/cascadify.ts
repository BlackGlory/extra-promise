import 'reflect-metadata'
import { isFunction } from '@blackglory/types'

const CASCADABLE = 'extra-promise:cascadable'

type Cascadify<T> = {
  [P in keyof T]:
    T[P] extends (...args: infer U) => PromiseLike<T> // cascadable method (...args: any) => PromiseLike<this>
    ? (...args: U) => Cascadify<T>
    : T[P] extends (...args: infer U) => PromiseLike<infer W> // async method as exit
      ? (...args: U) => Promise<W>
      : T[P] extends (...args: infer U) => infer W // sync method as exit
        ? (...args: U) => Promise<W>
        : Promise<T[P]> // property as exit
}

export function cascadify<T extends object>(target: T): Cascadify<T> {
  let promise: Promise<T> = Promise.resolve(target)

  const { proxy, revoke } = Proxy.revocable(target, {
    get(target, prop: string | symbol) {
      if (isFunction(getMember())) {
        return (...args: any) => {
          const result = Reflect.apply(getMember(), target, args)
          promise = promise.then(() => result)
          if (isCascadable(target, prop)) {
            return proxy
          } else {
            revoke()
            return promise
          }
        }
      } else {
        revoke()
        return promise.then(() => getMember())
      }

      function getMember() {
        return Reflect.get(target, prop)
      }
    }
  })

  return proxy as Cascadify<T>
}

export function cascadable(target: any, key: string) {
  Reflect.defineMetadata(CASCADABLE, true, target, key)
}

function isCascadable(target: any, key: string | symbol): boolean {
  return Reflect.getMetadata(CASCADABLE, target, key)
}
