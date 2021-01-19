const { TestScheduler } = require('jest')

class Encrypter {
  async compare (password, hashedPassword) {
    return true
  }
}

describe('Encrypter', () => {
  test('Should return true is bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashed_password')
    expect(isValid).toBe(true)
  })
})
