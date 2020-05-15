import { cascadify, cascadable } from '@src/functions/cascadify'
import { isFailure } from 'return-style'
import 'jest-extended'
import '@test/matchers'

describe('cascadify<T extends object>(target: T): Cascadify<T>', () => {
  describe('sync method T as exit', () => {
    it('exit return Promise<ReturnType<T>>', async () => {
      class Adder {
        value: number

        constructor(initialValue: number) {
          this.value = initialValue
        }

        get() {
          return this.value
        }

        @cascadable
        async add(value: number) {
          this.value += value
          return this
        }
      }

      const adder = new Adder(10)
      const cascadified = cascadify(adder)
      const result = cascadified
        .add(10)
        .get()
      const proResult = await result
      const isRevoke = isFailure(() => cascadified.value)

      expect(result).toBePromise()
      expect(proResult).toBe(20)
      expect(isRevoke).toBeTrue()
    })
  })

  describe('async method T as exit', () => {
    it('exit return Promise.resolve(ReturnType<T>)', async () => {
      class Adder {
        value: number

        constructor(initialValue: number) {
          this.value = initialValue
        }

        async get() {
          return this.value
        }

        @cascadable
        async add(value: number) {
          this.value += value
          return this
        }
      }

      const adder = new Adder(10)
      const cascadified = cascadify(adder)
      const result = cascadified
        .add(10)
        .get()
      const proResult = await result
      const isRevoke = isFailure(() => cascadified.value)

      expect(result).toBePromise()
      expect(proResult).toBe(20)
      expect(isRevoke).toBeTrue()
    })
  })

  describe('property T as exit', () => {
    it('exit return Promise<T>', async () => {
      class Adder {
        value: number

        constructor(initialValue: number) {
          this.value = initialValue
        }

        @cascadable
        async add(value: number) {
          this.value += value
          return this
        }
      }

      const adder = new Adder(10)
      const cascadified = cascadify(adder)
      const result = cascadified
        .add(10)
        .value
      const proResult = await result
      const isRevoke = isFailure(() => cascadified.value)

      expect(result).toBePromise()
      expect(proResult).toBe(20)
      expect(isRevoke).toBeTrue()
    })
  })
})
