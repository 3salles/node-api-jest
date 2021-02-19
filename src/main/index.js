const MongoHelper = require('../../src/infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.mongUrl).then(() => {
  const app = require('./config/app')
  app.listen(5858, () => console.log('🚀 Server Running on port 5858'))
}).catch(console.error)
