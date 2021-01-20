const validator = require('validator')
const MissingParamError = require('../errors/missing-params-error')

module.exports = class EmailValidator {
  isValid (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return validator.isEmail(email)
  }
}
