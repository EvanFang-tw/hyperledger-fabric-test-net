#!/bin/bash

docker exec cli.test.com ./scripts/buildTsChaincode.sh
docker exec cli.test.com ./scripts/installChaincode.sh tsacc 1.0 node /etc/hyperledger/chaincode/typescript
