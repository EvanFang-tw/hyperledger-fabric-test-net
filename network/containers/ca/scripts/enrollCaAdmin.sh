#!/bin/bash

export FABRIC_CA_CLIENT_HOME=/etc/hyperledger/admin
export FABRIC_CA_CLIENT_TLS_CERTFILES=/etc/hyperledger/ca/ca.crt

fabric-ca-client enroll -u https://admin:adminpw@ca.test.com:7054 --csr.hosts admin.ca.test.com
