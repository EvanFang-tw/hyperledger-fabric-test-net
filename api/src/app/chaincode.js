const gatewayFactory = require('./gatewayFactory')
const envHelper = require('../helpers/envHelper')
const parseHelper = require('../helpers/parseHelper')
const channelName = envHelper.get('CHANNEL_NAME')
const chaincode = envHelper.get('CHAINCODE_NAME')

// Execute invoke or query function depends on type
async function executeTransaction (type, fcn, args) {
  if (!args) {
    args = []
  }

  try {
    const gateway = await gatewayFactory.create()
    const network = await gateway.getNetwork(channelName)
    const contract = network.getContract(chaincode)

    let result = null

    if (type === 'invoke') {
      result = await contract.submitTransaction(fcn, ...args)
      await gateway.disconnect()
    } else if (type === 'query') {
      result = await contract.evaluateTransaction(fcn, ...args)
    }

    if (!result) {
      return ''
    }

    // Parse result
    // p.s. result is a buffer, to parse it, we need transform it to string
    return parseHelper.parse(result.toString())
  } catch (error) {
    throw new Error(error.message)
  }
}

// Exports invoke, query function
module.exports = {
  async invoke (fcn, args) {
    return executeTransaction('invoke', fcn, args)
  },
  async query (fcn, args) {
    return executeTransaction('query', fcn, args)
  },
  async getChannel () {
    const gateway = await gatewayFactory.create()
    const network = await gateway.getNetwork(channelName)
    const channel = network.getChannel()
    return channel
  }
}
