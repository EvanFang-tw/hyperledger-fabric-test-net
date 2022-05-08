#!/bin/bash

export CA_DIR=./tlscerts/ca
export PEER_DIR=./tlscerts/peer
export ORDERER_DIR=./tlscerts/orderer

[ ! -d "$CA_DIR" ] && mkdir -p $CA_DIR
[ ! -d "$PEER_DIR" ] && mkdir -p $PEER_DIR
[ ! -d "$ORDERER_DIR" ] && mkdir -p $ORDERER_DIR

export CERT_DIR=../network/crypto-config

# Copy ca tlscert
cp $CERT_DIR/peerOrganizations/test.com/ca/ca.crt $CA_DIR/ca.crt

# Copy peer tlscert
cp $CERT_DIR/peerOrganizations/test.com/tlsca/tlsca.test.com-cert.pem $PEER_DIR/tlsca.test.com-cert.pem

# Copy orderer tlscert
cp $CERT_DIR/ordererOrganizations/test.com/tlsca/tlsca.test.com-cert.pem $ORDERER_DIR/tlsca.test.com-cert.pem
