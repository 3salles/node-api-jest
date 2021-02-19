const express = require('express')
const app = express()
const setupApp = require('./setup.js')

setupApp(app)

module.exports = app
