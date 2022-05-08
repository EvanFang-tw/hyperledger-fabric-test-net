#!/bin/bash

export CHAINCODE_NAME=$1
export VERSION=$2
export LANG=$3 # Chaincode language, node or golang
export DIST_DIR=$4 # The folder where you place chaincode

export CHANNEL=mychannel
export ORDERER=orderer0.test.com:7050
export ORDERER_TLS_CERT=/etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem

pushd /etc/hyperledger

# Switch to peer0
CORE_PEER_ADDRESS=peer0.test.com:7051
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt

# Package chaincode
export PACKAGE_NAME=$CHAINCODE_NAME-$VERSION.out # e.g. sacc-1.0.out
peer chaincode package -n ${CHAINCODE_NAME} -v ${VERSION} -l ${LANG} -p ${DIST_DIR} ${PACKAGE_NAME}

# Install chaincode on peer0
peer chaincode install ${PACKAGE_NAME}

# Instantiate chaincode
peer chaincode instantiate -n $CHAINCODE_NAME -v $VERSION -C $CHANNEL -c '{"Args":[]}' -P "OR('Org1MSP.member')" -o $ORDERER --tls --cafile $ORDERER_TLS_CERT

# Switch to peer1
CORE_PEER_ADDRESS=peer1.test.com:8051
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer1.test.com/tls/ca.crt

# Install chaincode on peer1
peer chaincode install ${PACKAGE_NAME}

# Chaincode health check
export PEER0=peer0.test.com:7051
export PEER0_TLS=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt

CORE_PEER_ADDRESS=peer0.test.com:7051
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt
sleep 2
peer chaincode invoke -C $CHANNEL -n $CHAINCODE_NAME -c '{"Args":["set", "msg", "hello, world"]}' -o $ORDERER --tls --cafile $ORDERER_TLS_CERT --peerAddresses $PEER0 --tlsRootCertFiles $PEER0_TLS --waitForEvent
sleep 2
peer chaincode query -C $CHANNEL -n $CHAINCODE_NAME -c '{"Args":["get", "msg"]}'

popd