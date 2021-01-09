module.exports = class ServerError extends Error {
  constructor () {
    super('Sorry! We had a internal error. Please try again later.')
    this.name = 'ServerError'
  }
}
