#!/bin/bash

# Create docker network
export NETWORK=elk-net
if [ -z "$(docker network ls | grep -w $NETWORK)" ]; then
  docker network create --attachable $NETWORK
fi

source .env

docker-compose up -d
