const { configure, getLogger } = require('log4js')
configure({
  appenders: {
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'debug'
    }
  }
})

/**
 * Log service.
 * @param {string} appenders File appender, with configurable log rolling based on file size or date.
 * @returns {string} The log.
 */
function LogService (appenders) {
  this.logger = getLogger(appenders)
}

LogService.prototype.error = function error (message) {
  return this.logger.error(message)
}

LogService.prototype.info = function info (message) {
  return this.logger.info(message)
}

LogService.prototype.trace = function trace (message) {
  return this.logger.trace(message)
}

LogService.prototype.debug = function debug (message) {
  return this.logger.debug(message)
}

LogService.prototype.fatal = function fatal (message) {
  return this.logger.fatal(message)
}

LogService.prototype.warn = function warn (message) {
  return this.logger.warn(message)
}

module.exports = LogService
