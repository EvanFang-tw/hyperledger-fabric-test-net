#!/bin/bash

rm -rf crypto-config/ordererOrganizations
rm -rf crypto-config/peerOrganizations

rm channel-artifacts/genesis.block
rm channel-artifacts/channel.tx
rm channel-artifacts/Org1MSPanchors.tx

# Clear org2 artifacts
rm -rf ../org2.com/channel-artifacts
rm -rf ../org2.com/config
rm -rf ../org2.com/crypto-config

# Remove all containers
docker stop $(docker ps -a | grep .test.com | awk '{print $1}')
docker rm $(docker ps -a | grep .test.com | awk '{print $1}')

docker stop $(docker ps -a | grep .org2.com | awk '{print $1}')
docker rm $(docker ps -a | grep .org2.com | awk '{print $1}')

# Remove all container volumes
docker volume rm $(docker volume ls | grep .test.com | awk '{print $2}')
docker volume rm $(docker volume ls | grep .org2.com | awk '{print $2}')

# Remove all chaincode docker image
docker image rm $(docker image ls | grep .test.com | awk '{print $3}') -f
docker image rm $(docker image ls | grep .org2.com | awk '{print $3}') -f

# Delete docker network
export NETWORK=test-net
if [ "$(docker network ls | grep -w $NETWORK)" ]; then
  docker network rm $NETWORK
fi
