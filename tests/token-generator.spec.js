class TokenGenerator {
  async generate (id) {
    return null
  }
}

describe('Token Generator', () => {
  test('Should return null if JWT return null', async () => {
    const sut =  new TokenGenerator()
    const token = await sut.generate('any_any')
    expect(token).toBeNull()
  })
})