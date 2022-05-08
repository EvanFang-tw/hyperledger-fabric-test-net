const fs = require('fs')
const envHelper = require('../helpers/envHelper')
const connectionFilePath = envHelper.get('CONNECTION_FILE_PATH') || './connection.dev.json'
module.exports.profile = JSON.parse(fs.readFileSync(connectionFilePath, 'utf8'))
