const bcrypt = require('bcrypt')
const Encrypter = require('../src/utils/helpers/encrypter')
const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true is bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_avalue', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return false is bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
