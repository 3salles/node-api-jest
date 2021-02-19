const bcrypt = require('bcrypt')
const Encrypter = require('../../src/utils/helpers/encrypter')
const MissingParamError = require('../../src/utils/errors/missing-params-error')

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

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
