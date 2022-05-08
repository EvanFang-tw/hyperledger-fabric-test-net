#!/bin/bash

# Generate MSP
bin/cryptogen generate --config=./crypto-config.yaml

# Rename ca certs & keys(so that ca container can use them more easily)
mv crypto-config/peerOrganizations/test.com/ca/*.pem crypto-config/peerOrganizations/test.com/ca/ca.crt
mv crypto-config/peerOrganizations/test.com/ca/*_sk crypto-config/peerOrganizations/test.com/ca/ca.key

# Generate genesis block
bin/configtxgen -profile RaftGenesis -channelID sys-channel -outputBlock ./channel-artifacts/genesis.block

# Generate channel tx
export CHANNEL_NAME=mychannel
bin/configtxgen -profile SampleChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# Generate anchor peer tx
bin/configtxgen -profile SampleChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

# Create docker network
export NETWORK=test-net
if [ -z "$(docker network ls | grep -w $NETWORK)" ]; then
  docker network create --attachable $NETWORK
fi

# Start ca
docker-compose -f containers/ca.yaml up -d

# Start zookeepers
docker-compose -f containers/zookeeper0.yaml up -d
docker-compose -f containers/zookeeper1.yaml up -d
docker-compose -f containers/zookeeper2.yaml up -d

echo sleep a while...wait zookeeper ready
sleep 10

# Start kafkas
docker-compose -f containers/kafka0.yaml up -d
docker-compose -f containers/kafka1.yaml up -d
docker-compose -f containers/kafka2.yaml up -d
docker-compose -f containers/kafka3.yaml up -d

echo sleep a while...wait kafka ready
sleep 15

# Start orderers
docker-compose -f containers/orderer0.yaml up -d
docker-compose -f containers/orderer1.yaml up -d
docker-compose -f containers/orderer2.yaml up -d

# Start peers
docker-compose -f containers/peer0.yaml up -d
docker-compose -f containers/peer1.yaml up -d

# Start cli
docker-compose -f containers/cli.yaml up -d

echo sleep a while...
sleep 15

# Create & join channel
docker exec cli.test.com /etc/hyperledger/scripts/createChannel.sh

# Enroll ca admin, register a user for middleware
docker exec ca.test.com /etc/hyperledger/scripts/enrollCaAdmin.sh
docker exec ca.test.com /etc/hyperledger/scripts/registerClient.sh user userpw
