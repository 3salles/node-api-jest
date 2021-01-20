const jwt = require('jsonwebtoken')
class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret')
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_any')
    expect(token).toBeNull()
  })

  test('Should return a token if JWT returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_any')
    expect(token).toBe(jwt.token)
  })
})