#!/bin/bash

pushd /etc/hyperledger

# Switch to peer0
CORE_PEER_ADDRESS=peer0.test.com:7051
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt

# Create channel
peer channel create -o orderer0.test.com:7050 -c mychannel \
-f ./channel-artifacts/channel.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem

# Join peer0 to channel
peer channel join -b mychannel.block

# Update anchor peer
peer channel update -o orderer0.test.com:7050 -c mychannel \
-f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem

# Switch to peer1
CORE_PEER_ADDRESS=peer1.test.com:8051
CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer1.test.com/tls/ca.crt

# Join peer1 to channel
peer channel join -b mychannel.block

popd