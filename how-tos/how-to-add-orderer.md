# How to add a new orderer

For example, you wanna add a new orderer named `orderer3.test.com` to an existed kafka network.
```sh
# Start network first
cd network-kafka && ./start.sh
```

Prepare orderer3's docker-compose file
```yaml
version: '2'

volumes:
  orderer3.test.com:

networks:
  test-net:
    external: true

services:
  orderer3.test.com:
    image: hyperledger/fabric-orderer:1.4.4
    container_name: orderer3.test.com
    environment:
      - FABRIC_LOGGING_SPEC=INFO
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
      - ORDERER_GENERAL_TLS_ENABLED=true
      - ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt
      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key
      - ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric
    command: orderer
    volumes:
        - ../channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block
        - ../crypto-config/ordererOrganizations/test.com/orderers/orderer3.test.com/msp:/var/hyperledger/orderer/msp
        - ../crypto-config/ordererOrganizations/test.com/orderers/orderer3.test.com/tls/:/var/hyperledger/orderer/tls
        - orderer3.test.com:/var/hyperledger/production/orderer
    networks:
    - test-net
    ports:
    - 10050:7050
```

Add orderer3 to `crypto-config.yaml`
```yaml
OrdererOrgs:
  - Name: Orderer
    Domain: test.com
    EnableNodeOUs: true
    Specs:
      - Hostname: orderer0
      - Hostname: orderer1
      - Hostname: orderer2
      - Hostname: orderer3 # Add new orderer name here

PeerOrgs:
  - Name: Org1
    Domain: test.com
    EnableNodeOUs: true
    Template:
      Count: 2
    Users:
      Count: 1
```

Generate orderer3 MSP by running `cryptogen` with `extend` flag
```sh
bin/cryptogen extend --input="crypto-config" --config="crypto-config.yaml"
```

Start orderer3
```sh
docker-compose -f ./containers/orderer3.yaml up -d
```

Health check
```sh
# Invoke chaincode through orderer3
export CHAINCODE_NAME=sacc
export CHANNEL=mychannel
export ORDERER=orderer3.test.com:7050
export ORDERER_TLS_CERT=/etc/hyperledger/crypto/ordererOrganizations/test.com/orderers/orderer3.test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export PEER0=peer0.test.com:7051
export PEER0_TLS=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt
export CORE_PEER_ADDRESS=peer0.test.com:7051
export CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/test.com/peers/peer0.test.com/tls/ca.crt

peer chaincode invoke -C $CHANNEL -n $CHAINCODE_NAME -c '{"Args":["set", "msg", "hello, world 3"]}' -o $ORDERER --tls --cafile $ORDERER_TLS_CERT --peerAddresses $PEER0 --tlsRootCertFiles $PEER0_TLS --waitForEvent

peer chaincode query -C $CHANNEL -n $CHAINCODE_NAME -c '{"Args":["get", "msg"]}'
```