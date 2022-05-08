Install Go chaincode
```sh
./scripts/installGo.sh
```

Upgrade Go Chaincode
```sh
./scripts/upgradeGo.sh 1.1
```

Install Typescript chaincode
```sh
./scripts/installTs.sh
```

Upgrade Typescript Chaincode
```sh
./scripts/upgradeTs.sh 1.1
```

Check installed chaincodes(in cli)
```sh
peer chaincode list --installed
peer chaincode list --instantiated -C mychannel
```

Chaincode invoke & query(in cli)
```sh
export CHAINCODE=sacc
# export CHAINCODE=tsacc

peer chaincode invoke \
-C mychannel -n $CHAINCODE -c '{"Args":["set", "msg", "hello, world"]}' \
-o orderer0.test.com:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem \
--peerAddresses peer0.test.com:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt --waitForEvent

peer chaincode query -C mychannel -n $CHAINCODE -c '{"Args":["get", "msg"]}'
```
