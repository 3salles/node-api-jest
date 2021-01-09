module.exports = class UnauthorizedError extends Error {
  constructor () {
    super('Acess unauthorized')
    this.name = 'UnauthorizedError'
  }
}
