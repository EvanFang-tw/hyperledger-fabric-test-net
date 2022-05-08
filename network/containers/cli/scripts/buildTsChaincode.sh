#!/bin/bash

# Install tsc
export TSC=$(tsc -v)
if [ -z "$TSC" ]; then
  npm install -g typescript@3.7.5
fi

# Copy mounted chaincode source file to a specific dist folder,
# ensure chaincode path is fixed on every cli.
export SRC_DIR=/opt/gopath/src/github.com/chaincode/typescript
export DIST_DIR=/etc/hyperledger/chaincode/typescript

# Create dist directory
[ ! -d "$DIST_DIR" ] && mkdir -p $DIST_DIR

# If src directory already exists, remove it
[ -d "$DIST_DIR/src" ] && rm -rf "$DIST_DIR/src"

cp $SRC_DIR/package.json $DIST_DIR/package.json
cp $SRC_DIR/package-lock.json $DIST_DIR/package-lock.json
cp $SRC_DIR/tsconfig.json $DIST_DIR/tsconfig.json
cp -r $SRC_DIR/src $DIST_DIR/src

cd $DIST_DIR
npm install
npm run build