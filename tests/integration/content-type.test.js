const request = require('supertest')
const app = require('../../src/main/config/app')

describe('Content-Type Middleware', () => {
  test('Should return JSON content-type as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test_content_type').expect('content-type', /json/)
  })
})
