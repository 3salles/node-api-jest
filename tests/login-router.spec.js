const LoginRouter = require('../src/presentation/routers/login-router')
const MissingParamError = require('../src/presentation/helpers/missing-params-error')
const InvalidParamError = require('../src/presentation/helpers/invalid-param-error')
const UnauthorizedError = require('../src/presentation/helpers/unauthorized-error')
const ServerError = require('../src/presentation/helpers/server-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}

describe('Login Router', () => {
  describe('Bad Request Error', () => {
    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test(' Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorSpy } = makeSut()
      emailValidatorSpy.isEmailValid = false
      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
  })

  describe('Server Error', () => {
    test('Should return 500 if no httpRequest is provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.route()
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if no httpRequest has no body', async () => {
      const { sut } = makeSut()
      const httpRequest = {}
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if no AuthCase is provided', async () => {
      const sut = new LoginRouter()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if AuthUseCase has no auth method', async () => {
      class AuthUseCaseSpy {}
      const authUseCaseSpy = new AuthUseCaseSpy()
      const sut = new LoginRouter(authUseCaseSpy)
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if AuthUseCase throws', async () => {
      const authUseCaseSpy = makeAuthUseCaseWithError()
      const sut = new LoginRouter(authUseCaseSpy)
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    })

    test('Should return 500 if no EmailValidator is provided', async () => {
      const authUseCaseSpy = makeAuthUseCase()
      const sut = new LoginRouter(authUseCaseSpy)
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if no EmailValidator has no isValid method', async () => {
      const authUseCaseSpy = makeAuthUseCase()
      const sut = new LoginRouter(authUseCaseSpy, {})
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if EmailValidator throws', async () => {
      const authUseCaseSpy = makeAuthUseCase()
      const emailValidatorSpy = makeEmailValidatorWithError()
      const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    })
  })

  describe('Error 401', () => {
    test('Should return 401 when invalid credentials are provided', async () => {
      const { sut, authUseCaseSpy } = makeSut()
      authUseCaseSpy.accessToken = null
      const httpRequest = {
        body: {
          email: 'invalid_email@mail.com',
          password: 'invalide_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body).toEqual(new UnauthorizedError())
    })
  })

  describe('Success', () => {
    test('Should return 200 when valid credentials are provided', async () => {
      const { sut, authUseCaseSpy } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid_email@mail.com',
          password: 'valid_password'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
    })
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
