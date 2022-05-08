#!/bin/bash

export VERSION=$1

if [ -z $VERSION ]; then
  echo Need version
  exit 1
fi

docker exec cli.test.com ./scripts/upgradeChaincode.sh sacc $VERSION golang github.com/chaincode/go
