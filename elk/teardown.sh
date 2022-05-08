#!/bin/bash

# Remove all containers
docker stop $(docker ps -a | grep .elk | awk '{print $1}')
docker rm $(docker ps -a | grep .elk | awk '{print $1}')

# Remove all container volumes
docker volume rm $(docker volume ls | grep .elk | awk '{print $2}')

# Delete docker network
export NETWORK=elk-net
if [ "$(docker network ls | grep -w $NETWORK)" ]; then
  docker network rm $NETWORK
fi
