const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

// Logger
const LogService = require('./service/LogService')
const logger = new LogService('app')

// Routes
const indexRoutes = require('./routes/index.routes')

const app = express()

// Allow CORS
app.options('*', cors())
app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(morgan('combined'))

app.use('/', indexRoutes)

// Error catcher
app.use((err, req, res, next) => {
  // Handle other errors
  logger.error(err.message)
  logger.error(err.stack)
  res.status(500).send('Something broke!')
  next()
})

module.exports = app
