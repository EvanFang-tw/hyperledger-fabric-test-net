const chaincode = require('../app/chaincode')

module.exports = {
  async index (req, res) {
    res.send('Blockchain api service')
  },
  async get (req, res) {
    const { key } = req.params
    try {
      const result = await chaincode.query('get', [key])
      return res.send(result)
    } catch (err) {
      return res.status(500).send(err)
    }
  },
  async set (req, res) {
    const { key, value } = req.body

    // Check inputs
    if (!key) {
      return res.status(422).send('key is required')
    }
    if (!value) {
      return res.status(422).send('value is required')
    }

    // Invoke chaincode
    try {
      const txid = await chaincode.invoke('set', [key, value])
      return res.send({
        success: true,
        txid
      })
    } catch (error) {
      return res.status(500).send(error)
    }
  }
}
