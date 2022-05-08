const envHelper = require('../../src/helpers/envHelper')
const expect = require('chai').expect
const dotenv = require('dotenv')
const sinon = require('sinon')

describe('envHelper', () => {
  describe('set', () => {
    it('should work with custom config', () => {
      // Arrange
      const customEnv = {
        FOO: 'foo',
        BAR: 'bar'
      }

      // Action
      envHelper.set(customEnv)
      const env = envHelper.get()

      // Assert
      expect(env).deep.equals(customEnv)
    })

    describe('when custom config is not provided', () => {
      it('should call dotenv.config()', () => {
        // Arrange
        const dotenvSpy = sinon.spy(dotenv, 'config')

        // Action
        envHelper.set()

        // Assert
        expect(dotenvSpy.callCount).equals(1)
      })
    })
  })

  describe('get', () => {
    describe('when env variable is not found', () => {
      it('should return empty string', () => {
        // Action
        const result = envHelper.get('I_AM_NOT_EXIST')

        // Assert
        expect(result).equals('')
      })
    })
  })
})
