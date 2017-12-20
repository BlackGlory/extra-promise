import chain from '../../src/fn/chain'

class Box {
  constructor(val) {
    this.val = val
  }

  add(val) {
    return new Promise(resolve => {
      this.val += val
      resolve(this)
    })
  }

  get() {
    return Promise.resolve(this.val)
  }
}

test('chain(fn)', async () => {
  function createBox(val) {
    return Promise.resolve(new Box(val))
  }

  expect(await chain(createBox)(1).add(2).get()).toEqual(3)
  expect(await chain(createBox)(1).add(2).get()).toEqual(await (await (await createBox(1)).add(2)).get())
  expect(await chain(createBox)(1).add(2).get()).toEqual(await createBox(1).then(x => x.add(2)).then(x => x.get()))
})

test('chain(obj)', async () => {
  expect(await chain(new Box(1)).add(2).get()).toEqual(3)
  expect(await chain(new Box(1)).add(2).get()).toEqual(await (await (new Box(1)).add(2)).get())
  expect(await chain(new Box(1)).add(2).get()).toEqual(await (new Box(1)).add(2).then(x => x.get()))
})
