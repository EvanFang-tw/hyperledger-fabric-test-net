const envHelper = require('../helpers/envHelper')
const fs = require('fs')
const path = require('path')
// const rp = require('request-promise');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network')
const FabricCAServices = require('fabric-ca-client')
const wallet = new FileSystemWallet(path.join(process.cwd(), 'wallet'))
const LogService = require('../service/LogService')
const logger = new LogService('Wallet')

async function enroll () {
  const enrollmentID = envHelper.get('CA_ENROLLMENT_ID')
  const enrollmentSecret = envHelper.get('CA_ENROLLMENT_SECRET')
  const certPath = envHelper.get('CA_CERT_PATH')
  const caUrl = envHelper.get('CA_URL')
  const caName = envHelper.get('CA_NAME')
  const mspID = envHelper.get('CA_MSPID')

  try {
    // Create a new CA client for interacting with the CA.
    const caTLSCACertsPath = path.resolve(process.cwd(), certPath)
    const caTLSCACerts = fs.readFileSync(caTLSCACertsPath)

    const ca = new FabricCAServices(
      caUrl,
      {
        trustedRoots: caTLSCACerts,
        verify: false
      },
      caName
    )

    // Enroll the user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret
    })
    const identity = X509WalletMixin.createIdentity(
      mspID,
      enrollment.certificate,
      enrollment.key.toBytes()
    )
    await wallet.import(enrollmentID, identity)

    logger.info(`Successfully enrolled user ${enrollmentID} and imported it into the wallet`)
    return 'Success'
  } catch (error) {
    logger.error(`Failed to enroll user ${enrollmentID}: ${error}`)
    logger.warn('Server is still starting...')
    return error
  }
}

module.exports = {
  getWallet () {
    return wallet
  },
  async importIdentity () {
    const enrollmentID = envHelper.get('CA_ENROLLMENT_ID')

    // Check to see if we've already enrolled the user.
    const exists = await wallet.exists(enrollmentID)
    if (exists) {
      return 'Success'
    }

    // Enroll
    return enroll()
  }
}
