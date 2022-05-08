#!/bin/bash

export FABRIC_CA_CLIENT_HOME=/etc/hyperledger/admin
export FABRIC_CA_CLIENT_TLS_CERTFILES=/etc/hyperledger/ca/ca.crt

export ID=$1
export SECRET=$2

if [ -z "$ID" ]; then
  $ID="user"
fi
if [ -z "$SECRET" ]; then
  $ID="userpw"
fi

fabric-ca-client register --id.name $ID --id.secret $SECRET --id.type client -u https://admin:adminpw@ca.test.com:7054
