docker exec -it cli.test.com bash

export CORE_PEER_LOCALMSPID=OrdererMSP
export CORE_PEER_ADDRESS=orderer0.test.com:7050
export CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/ordererOrganizations/test.com/users/Admin@test.com/msp
export ORDERER=orderer0.test.com:7050
export ORDERER_CA_FILE=/etc/hyperledger/crypto/ordererOrganizations/test.com/msp/tlscacerts/tlsca.test.com-cert.pem
export SYS_CHANNELID=sys-channel
export CONSORTIUM_NAME=SampleConsortium
export NEW_ORG_MSPID=Org2MSP

# Fetch genesis block
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
