const envHelper = require('./helpers/envHelper')
envHelper.set()

const wallet = require('./app/wallet')
const app = require('./app')
const port = envHelper.get('PORT') || 3000

// Logger
const LogService = require('./service/LogService')
const logger = new LogService('server')

// Check required environment variables
try {
  envHelper.check()
} catch (error) {
  logger.error(error.message)
  process.exit(1)
}

wallet
  .importIdentity()
  .then(() => {
    app.listen(port, () => logger.info('middleware is started'))
  })
  .catch(error => {
    logger.error(error)
    process.exit(1)
  })
