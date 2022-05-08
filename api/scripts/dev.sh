#!/bin/bash

./scripts/copyCert.sh

docker-compose -f docker-compose.dev.yaml up -d

# Enter middleware container
docker exec -it middleware0.test.com bash
