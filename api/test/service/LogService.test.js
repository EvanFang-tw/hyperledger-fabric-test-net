const LogService = require('../../src/service/LogService')
const sinon = require('sinon')

describe('LogService', () => {
  it('should work', () => {
    const logger = new LogService('unit-test')

    const traceSpy = sinon.spy(logger, 'trace')
    logger.trace('trace should work')

    const debugSpy = sinon.spy(logger, 'debug')
    logger.debug('debug should work')

    const infoSpy = sinon.spy(logger, 'info')
    logger.info('info should work')

    const warnSpy = sinon.spy(logger, 'warn')
    logger.warn('warn should work')

    const errorSpy = sinon.spy(logger, 'error')
    logger.error('error should work')

    const fatalSpy = sinon.spy(logger, 'fatal')
    logger.fatal('fatal should work')

    sinon.assert.calledWith(traceSpy, 'trace should work')
    sinon.assert.calledWith(debugSpy, 'debug should work')
    sinon.assert.calledWith(infoSpy, 'info should work')
    sinon.assert.calledWith(errorSpy, 'error should work')
    sinon.assert.calledWith(warnSpy, 'warn should work')
    sinon.assert.calledWith(infoSpy, 'info should work')
    sinon.assert.calledWith(fatalSpy, 'fatal should work')
  })
})
