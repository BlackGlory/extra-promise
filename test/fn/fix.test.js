import fix from '../../src/fn/fix'

test('fix example', async () => {
  let stable = false

  async function unstableFunction() {
    if (stable) {
      return 'Stable'
    } else {
      throw new Error('Unstable')
    }
  }

  const stableFunction = fix(unstableFunction, () => stable = true)

  expect(await stableFunction()).toEqual('Stable')
})
