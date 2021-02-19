const MongoHelper = require('../../src/infra/repositories/helpers/mongo-helper')

describe('Mongo Helper', () => {
  test('Should reconnect when getDb() is invoked an client is disconnect', async () => {
    const sut = MongoHelper
    await sut.connect(process.env.MONGO_URL)
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getDb()
    expect(sut.db).toBeTruthy()
  })
})
