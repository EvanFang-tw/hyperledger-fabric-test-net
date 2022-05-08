# Add New Organization

## Preparation(Org2)

Prepare org2 cryptos

```sh
cd org2.com
```

Get binaries(for cryptogen, configtxgen)
```sh
./bootstrap.sh 1.4.4 1.4.4 0.4.18 -s -d
```

Prepare crypto.yaml file

```sh
touch org2-crypto.yaml
```

```yaml
# org2-crypto.yaml
PeerOrgs:
  - Name: Org2
    Domain: org2.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1
```

Generate the crypto material
```sh
./bin/cryptogen generate --config=./org2-crypto.yaml
```

Prepare configtx.yaml
```sh
touch configtx.yaml
```

```yaml
# configtx.yaml
Organizations:
  - &Org2
    Name: Org2MSP
    ID: Org2MSP
    MSPDir: crypto-config/peerOrganizations/org2.com/msp
    Policies:
      Readers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.peer', 'Org2MSP.client')"
      Writers:
        Type: Signature
        Rule: "OR('Org2MSP.admin', 'Org2MSP.client')"
      Admins:
        Type: Signature
        Rule: "OR('Org2MSP.admin')"
    AnchorPeers:
      - Host: peer0.org2.com
        Port: 11051
```

Print out the Org2-specific configuration material in JSON
```sh
export FABRIC_CFG_PATH=$PWD
mkdir -p channel-artifacts
./bin/configtxgen -printOrg Org2MSP > ./channel-artifacts/org2.json
```

Copy org2.json to org1's channel artifacts folder, because org1's cli need this file to generate config blocks.
```sh
# If you are using KAFKA network
cp ./channel-artifacts/org2.json ../network-kafka/channel-artifacts

# Or you are using RAFT network
cp ./channel-artifacts/org2.json ../network/channel-artifacts
```

Copy orderer tls cert to crypto-config(allow for communication to the network’s ordering node)
```sh
# If you are using KAFKA network
cp -r ../network-kafka/crypto-config/ordererOrganizations crypto-config/

# Or you are using RAFT network
cp -r ../network/crypto-config/ordererOrganizations crypto-config/
```

## Generate/sign channel update block(Org1)

```sh
docker exec -it cli.test.com bash

export ORDERER_CA=/etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export CHANNEL_NAME=mychannel

# Fetch the configuration
peer channel fetch config config_block.pb -o orderer0.test.com:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA

# Convert the configuration to JSON and trim it down
configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json
```

Add the Org2 crypto material
```sh
# Append the Org2 configuration definition – org2.json – to the channel’s application groups field
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org2MSP":.[1]}}}}}' config.json ./channel-artifacts/org2.json > modified_config.json

# Translate config.json back into a protobuf called config.pb
configtxlator proto_encode --input config.json --type common.Config --output config.pb

# Encode modified_config.json to modified_config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb

# Calculate the delta between these two config protobufs. Output a new protobuf binary named org2_update.pb
configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output org2_update.pb

# Decode org2_update.pb into editable JSON format and call it org2_update.json
configtxlator proto_decode --input org2_update.pb --type common.ConfigUpdate | jq . > org2_update.json

# Wrap in an envelope message named org2_update_in_envelope.json. Give us back the header field that we stripped away earlier.
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat org2_update.json)'}}}' | jq . > org2_update_in_envelope.json

# Convert org2_update_in_envelope.json into protobuf format
configtxlator proto_encode --input org2_update_in_envelope.json --type common.Envelope --output org2_update_in_envelope.pb
```

## Sign and Submit the Config Update(Org1)
```sh
# Sign this update proto as the Org1 Admin
peer channel signconfigtx -f org2_update_in_envelope.pb

# Update channel config
peer channel update -f org2_update_in_envelope.pb -c $CHANNEL_NAME -o orderer0.test.com:7050 --tls --cafile $ORDERER_CA

# Check all good, and leave cli
exit
```

## Join Org2 to the Channel(Org2)

Prepare docker-compose file
```sh
# In org2.com folder
touch docker-compose.yaml
```

```yaml
# docker-compose.yaml
version: '2'

volumes:
  peer0.org2.com:
  couchdb0.org2.com:

networks:
  test-net:
    external: true

services:

  couchdb0.org2.com:
    container_name: couchdb0.org2.com
    image: hyperledger/fabric-couchdb:0.4.18
    environment:
      - COUCHDB_USER=
      - COUCHDB_PASSWORD=
    volumes:
      - couchdb0.org2.com:/opt/couchdb/data
    ports:
      - 7984:5984
    networks:
      - test-net
  
  peer0.org2.com:
    image: hyperledger/fabric-peer:1.4.4
    # image: hyperledger/fabric-peer:$IMAGE_TAG
    container_name: peer0.org2.com
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=test-net
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_LOCALMSPID=Org2MSP
      - CORE_PEER_ID=peer0.org2.com
      - CORE_PEER_ADDRESS=peer0.org2.com:11051
      - CORE_PEER_LISTENADDRESS=0.0.0.0:11051
      - CORE_PEER_CHAINCODEADDRESS=peer0.org2.com:7052
      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:7052
      # Gossip
      # - CORE_PEER_GOSSIP_BOOTSTRAP=peer1.org2.com:8051 # Remark because no org2
      - CORE_PEER_GOSSIP_EXTERNALENDPOINT=peer0.org2.com:11051
      - CORE_PEER_GOSSIP_USELEADERELECTION=true
      - CORE_PEER_GOSSIP_ORGLEADER=false
      - CORE_PEER_PROFILE_ENABLED=true
      # TLS
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt
      # CouchDB
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0.org2.com:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    command: peer node start
    volumes:
        - /var/run/:/host/var/run/
        - ./crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/msp:/etc/hyperledger/fabric/msp
        - ./crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls:/etc/hyperledger/fabric/tls
        - peer0.org2.com:/var/hyperledger/production
    depends_on:
      - couchdb0.org2.com
    ports:
      - 11051:7051
    networks:
      - test-net

  cli.org2.com:
    container_name: cli.org2.com
    image: hyperledger/fabric-tools:1.4.4
    tty: true
    stdin_open: true
    environment:
      # - SYS_CHANNEL=$SYS_CHANNEL
      - GOPATH=/opt/gopath
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - FABRIC_LOGGING_SPEC=INFO
      - CORE_PEER_ID=cli.org2.com
      - CORE_PEER_ADDRESS=peer0.org2.com:11051
      - CORE_PEER_LOCALMSPID=Org2MSP
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/crypto/peerOrganizations/org2.com/peers/peer0.org2.com/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/crypto/peerOrganizations/org2.com/peers/peer0.org2.com/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/org2.com/peers/peer0.org2.com/tls/ca.crt
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/org2.com/users/Admin@org2.com/msp
    working_dir: /etc/hyperledger
    command: /bin/bash
    volumes:
        - /var/run/:/host/var/run/
        - ./sacc/:/opt/gopath/src/github.com/chaincode/sacc
        # - ./cli/scripts:/etc/hyperledger/scripts/
        - ./crypto-config:/etc/hyperledger/crypto/
        # - ../channel-artifacts:/etc/hyperledger/channel-artifacts
    networks:
      - test-net
```

Fetch channel block and join channel
```sh
docker-compose up -d

docker exec -it cli.org2.com bash

export ORDERER_CA=/etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export CHANNEL_NAME=mychannel

# Fetch channel block from orderer
peer channel fetch 0 mychannel.block -o orderer0.test.com:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA

# Join channel
peer channel join -b mychannel.block

# Check joined channel
peer channel list

# Check all good, and leave cli
exit
```

Health check
```sh
# Channel info should be equal at each org's peer
docker exec -it cli.test.com peer channel getinfo -c mychannel
docker exec -it cli.org2.com peer channel getinfo -c mychannel
```

## Try install chaicode on new peer(Org2)
```sh
docker exec -it cli.org2.com bash

peer chaincode package -n sacc-org2 -v 1.0 -p github.com/chaincode/sacc sacc-org2.out

peer chaincode install sacc-org2.out

peer chaincode instantiate -n sacc-org2 -v 1.0 -C mychannel -c '{"Args":["a","b"]}' -P "OR('Org1MSP.member', 'Org2MSP.member')" -o orderer0.test.com:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem

peer chaincode list --instantiated -C mychannel

# Invoke
peer chaincode invoke -C mychannel -n sacc-org2 -c '{"Args":["set", "msg", "hello, world"]}' -o orderer0.test.com:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem --waitForEvent

# Query
peer chaincode query -C mychannel -n sacc-org2 -c '{"Args":["get", "msg"]}'

# Leave
exit

# Check both organization have this chaincode instantiated
docker exec -it cli.test.com peer chaincode list --instantiated -C mychannel
docker exec -it cli.org2.com peer chaincode list --instantiated -C mychannel
```

## Create channel on Org2

Create a new channel from org2.

> Make sure you are in org2.com/new-channel folder

In org2 cli:
```sh
# Generate channel.tx
cd new-channel/

export FABRIC_CFG_PATH=$PWD
../bin/configtxgen -profile SampleChannel -outputCreateChannelTx ./channel.tx -channelID mychannel-org2

# Copy channel.tx into org2 cli
docker cp ./channel.tx cli.org2.com:/etc/hyperledger/channel.tx

# Create channel
docker exec -it cli.org2.com bash

peer channel create -o orderer0.test.com:7050 -c mychannel-org2 \
-f ./channel.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem
```

You will get an error like:
> Error: got unexpected status: BAD_REQUEST -- Attempted to include a member which is not in the consortium

## Update system channel configuration

```sh
docker exec -it cli.test.com bash

export CORE_PEER_LOCALMSPID=OrdererMSP
export CORE_PEER_ADDRESS=orderer0.test.com:7050
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/ordererOrganizations/test.com/users/Admin@test.com/msp
export ORDERER=orderer0.test.com:7050
export ORDERER_CA_FILE=/etc/hyperledger/crypto/ordererOrganizations/test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export SYS_CHANNELID=sys-channel
export CONSORTIUM_NAME=SampleConsortium
export NEW_ORG_MSPID=Org2MSP

# Fetch system channel block
peer channel fetch config genesis.pb -o $ORDERER -c sys-channel --tls --cafile $ORDERER_CA_FILE

# Decode genesis block to json
configtxlator proto_decode --input genesis.pb --type common.Block | jq .data.data[0].payload.data.config > genesisBlock.json

# Add new organization definition(org2.json) to json
jq -s '.[0] * {"channel_group":{"groups":{"Consortiums":{"groups":{"'$CONSORTIUM_NAME'":{"groups":{"'$NEW_ORG_MSPID'":.[1]}}}}}}}' genesisBlock.json ./channel-artifacts/org2.json > genesisBlockChanges.json

# genesisBlock.json => genesisBlock.pb
configtxlator proto_encode --input genesisBlock.json --type common.Config --output genesisBlock.pb

# genesisBlockChanges.json => genesisBlockChanges.pb
configtxlator proto_encode --input genesisBlockChanges.json --type common.Config --output genesisBlockChanges.pb

# Compute diff(genesisBlock.pb, genesisBlockChanges.pb) => genesisBlocProposal_Org2.pb
configtxlator compute_update --channel_id $SYS_CHANNELID --original genesisBlock.pb --updated genesisBlockChanges.pb --output genesisBlocProposal_Org2.pb

# genesisBlocProposal_Org2.pb => genesisBlocProposal_Org2.json
configtxlator proto_decode --input genesisBlocProposal_Org2.pb --type common.ConfigUpdate | jq . > genesisBlocProposal_Org2.json

# append header to genesisBlocProposal_Org2.json, output is genesisBlocProposalReady.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$SYS_CHANNELID'", "type":2}},"data":{"config_update":'$(cat genesisBlocProposal_Org2.json)'}}}' | jq . > genesisBlocProposalReady.json

# genesisBlocProposalReady.json => genesisBlocProposalReady.pb
configtxlator proto_encode --input genesisBlocProposalReady.json --type common.Envelope --output genesisBlocProposalReady.pb

# Update system channel config
peer channel update -f genesisBlocProposalReady.pb -c sys-channel -o $ORDERER --tls --cafile $ORDERER_CA_FILE
```
> You will see: 2020-05-19 02:17:07.136 UTC [channelCmd] update -> INFO 002 Successfully submitted channel update
> `exit` org1 cli

Now, create channel again:
```sh
# Enter
docker exec -it cli.org2.com bash

# Create channel
peer channel create -o orderer0.test.com:7050 -c mychannel-org2 \
-f ./channel.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem

# Join channel
peer channel join -b mychannel-org2.block

# Check list
peer channel list

# All good, leave
exit
```

Check whether org1 can join this channel
```sh
# Copy channel block from org2 cli to org1 cli
docker cp cli.org2.com:/etc/hyperledger/mychannel-org2.block ./mychannel-org2.block
docker cp ./mychannel-org2.block cli.test.com:/etc/hyperledger/mychannel-org2.block
rm mychannel-org2.block

docker exec -it cli.test.com bash

peer channel join -b mychannel-org2.block
```
If you checl logs of `peer0.test.com`, you shall see:
> 2020-05-19 09:41:13.855 UTC [blocksProvider] DeliverBlocks -> ERRO 23b1 [mychannel-org2] Got error &{FORBIDDEN}
> 
> 2020-05-19 09:41:13.855 UTC [blocksProvider] DeliverBlocks -> ERRO 23b2 [mychannel-org2] Wrong statuses threshold passed, stopping block provider

This is because `mychannel-org2` does not know org1.

To make `peer0.test.com` join `mychannel-org2` successfully, you need to add org1 into `mychannel-org2` by updating channel configuration.

## Add org1 into org2 channel

```sh
# If you are using RAFT
cd network-kafka

# Else if you are using RAFT
cd network

# Print org1.json
export FABRIC_CFG_PATH=$PWD
./bin/configtxgen -printOrg Org1MSP > ./channel-artifacts/org1.json

# Copy org1.json to org2 cli
docker cp ./channel-artifacts/org1.json cli.org2.com:/etc/hyperledger/org1.json

# Enter org2
docker exec -it cli.org2.com bash

export ORDERER_CA=/etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer0.test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export CHANNEL_NAME=mychannel-org2

peer channel fetch config config_block.pb -o orderer0.test.com:7050 -c $CHANNEL_NAME --tls --cafile $ORDERER_CA

configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config > config.json

jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org1MSP":.[1]}}}}}' config.json ./org1.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb

configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb

configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output org1_update.pb

configtxlator proto_decode --input org1_update.pb --type common.ConfigUpdate | jq . > org1_update.json

echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat org1_update.json)'}}}' | jq . > org1_update_in_envelope.json

configtxlator proto_encode --input org1_update_in_envelope.json --type common.Envelope --output org1_update_in_envelope.pb

# Sign
peer channel signconfigtx -f org1_update_in_envelope.pb

# Update
peer channel update -f org1_update_in_envelope.pb -c $CHANNEL_NAME -o orderer0.test.com:7050 --tls --cafile $ORDERER_CA

# Leave
exit
```

Check peer log again, you shall notice that there's no more `[ERROR]` logs.
```
 docker logs -f peer0.test.com
```
