const envHelper = require('../helpers/envHelper')
const { Gateway } = require('fabric-network')
const wallet = require('./wallet').getWallet()

module.exports = {
  async create () {
    const cp = require('./connection').profile
    const userName = envHelper.get('CA_ENROLLMENT_ID')
    const userExists = await wallet.exists(userName)
    if (userExists === false) {
      const msg = `Wallet needs identity: ${userName}`
      throw msg
    }

    const gateway = new Gateway()
    await gateway.connect(cp, {
      wallet,
      identity: userName,
      discovery: { enabled: false }
    })

    return gateway
  }
}
