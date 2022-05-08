#!/bin/bash

TARGET=$(docker ps -a | grep "middleware[01].test.com" | awk '{print $1}')
docker stop $TARGET
docker rm $TARGET

# Because wallet folder is created in container, need root to remove it.
sudo rm -rf ./wallet
