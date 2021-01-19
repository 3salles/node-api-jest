const bcrypt = require('bcrypt')
class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  test('Should return true is bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_avalue', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return false is bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })
})
