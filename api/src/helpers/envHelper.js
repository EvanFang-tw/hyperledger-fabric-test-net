const dotenv = require('dotenv')

let env = null

function setEnv (config) {
  if (config) {
    // Using custom env config
    env = config
  } else {
    // Using default process env
    dotenv.config()
    env = process.env
  }
}

function getEnv (name) {
  if (!env) {
    setEnv()
  }

  if (!name) {
    return env
  }

  if (!env[name]) {
    return ''
  }

  return env[name]
}

// Check system required env variables
function checkRequiredVariables () {
  const envArray = [
    'PORT',
    'CHANNEL_NAME',
    'CHAINCODE_NAME'
  ]

  envArray.forEach(element => {
    if (!process.env[element]) {
      throw new Error(`${element} is required`)
    }
  })
}

module.exports = {
  set: setEnv,
  get: getEnv,
  check: checkRequiredVariables
}
