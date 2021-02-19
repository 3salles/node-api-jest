jest.mock('validator', () => ({
  isEmailValid: true,

  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))

const validator = require('validator')
const EmailValidator = require('../../src/utils/helpers/email-validator')
const MissingParamError = require('../../src/utils/errors/missing-params-error')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@mail.com')
    expect(validator.email).toBe('any_email@mail.com')
  })

  test('Should throw if no email is provided', () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
