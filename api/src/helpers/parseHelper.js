// Parse chaincode response from query or invoke transaction
function parseChaincodeResult (str) {
  if (!str) {
    return ''
  }

  if (str[0] === '{' && str.slice(-1) === '}') {
    // str is an object
    // e.g. {"foo":"FOO","bar":"BAR"}
    str = JSON.parse(str)
  } else if (str[0] === '[' && str.slice(-1) === ']') {
    // str is an array
    // e.g. [{"foo":"FOO","bar":"BAR"}]
    str = JSON.parse(str)
  } else if (str.startsWith('"{\\"') || str.startsWith('"[{\\"')) {
    // str is a stringified object or an array
    // e.g. "{\"foo\":\"FOO\",\"bar\":\"BAR\"}"
    // e.g. "[{\"timestamp\":{\"low\":1565856494,\"high\":0,\"unsigned\":false},\"txid\":\"id\",\"value\":\"value\"}]"
    str = JSON.parse(JSON.parse(str))
  } else {
    if (str[0] === '"' && str[str.length - 1] === '"') {
      // str is a string, e.g. "hello, world"
      str = str.substr(1, str.length - 2)
    }
  }

  return str
}

module.exports = {
  parse: parseChaincodeResult
}
