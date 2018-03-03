'use strict'

import chain from '../../src/fn/chain'

class Box {
  val: number

  constructor(val: number) {
    this.val = val
  }

  add(val: number) {
    return new Promise<Box>(resolve => {
      this.val += val
      resolve(this)
    })
  }

  get() {
    return Promise.resolve(this.val)
  }
}

test('chain(fn)', async () => {
  function createBox(val: number) {
    return Promise.resolve<Box>(new Box(val))
  }

  expect(await chain(createBox)(1).add(2).get()).toEqual(3)
  expect(await chain(createBox)(1).add(2).get()).toEqual(
    await (
      await (
        await createBox(1)
      ).add(2)
    ).get()
  )
  expect(await chain(createBox)(1).add(2).get()).toEqual(
    await createBox(1)
      .then(x => x.add(2))
      .then(x => x.get())
  )
})

test('chain(obj)', async () => {
  expect(await chain(new Box(1)).add(2).get()).toEqual(3)
  expect(await chain(new Box(1)).add(2).get()).toEqual(
    await (
      await (
        new Box(1)
      ).add(2)
    ).get()
  )
  expect(await chain(new Box(1)).add(2).get()).toEqual(
    await (new Box(1)).add(2).then(x => x.get())
  )
})

test('chain example', async () => {
  class Calculator {
    value: number

    constructor(initialValue: number) {
      this.value = initialValue
    }

    async get() {
      return this.value
    }

    async add(value: number) {
      this.value += value
      return this
    }

    async sub(value: number) {
      this.value -= value
      return this
    }
  }

  // use chain()
  expect(
    await chain(new Calculator(100))
      .add(50)
      .sub(100)
      .get()
  ).toEqual(50)

  // only use await
  expect(
    await (
      await (
        await (
          new Calculator(100).add(50)
        )
      ).sub(100)
    ).get()
  ).toEqual(50)

  // only use then()
  expect(await new Calculator(100).add(50)
    .then(x => x.sub(100))
    .then(x => x.get())).toEqual(50)
})
