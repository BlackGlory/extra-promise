import silent from '../../src/fn/silent'

test('silent example', async () => {
  async function noiseMaker() {
    throw new Error('New problem!')
  }

  const silentMaker = silent(noiseMaker)

  await silentMaker()
})
