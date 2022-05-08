const sinon = require('sinon')
const chaincode = require('../../src/app/chaincode')
const controller = require('../../src/controllers/index.controller')
const expect = require('chai').expect
const { mockReq, mockRes } = require('sinon-express-mock')

describe('index controller', () => {
  describe('index', () => {
    it('should work', () => {
      // Arrange
      const req = mockReq()
      const res = mockRes()

      // Action
      controller.index(req, res)

      // Assert
      expect(res.send.callCount).equals(1)
      expect(res.send.calledWith('Blockchain api service')).equals(true)
    })
  })

  describe('/query should works', () => {
    it('should query chaincode: getMessage', async () => {
      // // Arrange
      const req = mockReq()
      const res = mockRes()

      // Arrange
      const stub = sinon.stub(chaincode, 'query').resolves('hello, world')

      // Action
      await controller.get(req, res)

      // Assert
      expect(stub.callCount).equals(1)
      expect(stub.firstCall.args[0]).equals('get')

      expect(res.send.callCount).equals(1)
      expect(res.send.firstCall.args[0]).equals('hello, world')

      // Restore
      stub.restore()
    })
  })

  describe('/invoke should works', () => {
    it('should invoke chaincode: setMessage', async () => {
      // // Arrange
      const req = mockReq()
      const res = mockRes()

      req.body = {
        key: 'key-test',
        value: 'value-test'
      }

      // Arrange
      const stub = sinon.stub(chaincode, 'invoke')

      // Action
      await controller.set(req, res)

      // Assert
      expect(stub.callCount).equals(1)
      expect(stub.firstCall.args[0]).equals('set')

      expect(res.send.callCount).equals(1)

      const foo = res.send.firstCall.args[0]
      expect(foo.success).equals(true)
      expect(foo).have.property('txid')

      // Restore
      stub.restore()
    })

    it('should return 422 if body is empty', () => {
      // Arrange
      const req = mockReq()
      const res = mockRes()

      // Action
      controller.set(req, res)

      // Assert
      expect(res.status.calledWith(422)).equals(true)
    })
  })
})
