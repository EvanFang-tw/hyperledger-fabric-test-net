#!/bin/bash

./scripts/copyCert.sh

docker run -itd -p 3000:3000 --name middleware0.test.com --network test-net \
-v $(pwd)/tlscerts/:/home/middleware/tlscerts \
-v $(pwd)/connection.dev.json:/home/middleware/connection.dev.json \
--env PORT=3000 \
--env CHANNEL_NAME=mychannel \
--env CHAINCODE_NAME=sacc \
--env CA_ENROLLMENT_ID=user \
--env CA_ENROLLMENT_SECRET=userpw \
--env CA_CERT_PATH=/home/middleware/tlscerts/ca/ca.crt \
--env CA_URL=https://ca.test.com:7054 \
--env CA_NAME=ca.test.com \
--env CA_MSPID=Org1MSP \
--env CONNECTION_FILE_PATH=/home/middleware/connection.dev.json \
test-net/middleware:latest
