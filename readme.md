### Start test-net

Start blockchain network
```sh
# Raft
cd network
./start.sh

# Kafka
cd network-kafka
./start.sh
```
> Use `teardown.sh` to completely remove blockchain

Install chaincode on all peers
```sh
cd chaincode
./scripts/installGo.sh
```
> Use `installTs.sh` to install typescript chaincode
>
> Use `upgradeGo.sh 1.1` or `upgradeTs.sh 1.1` to upgrade chaincode

Start middleware
```sh
cd api
./scripts/dev.sh

# In middleware container:

  # Install dependencies
  npm install

  # Start api server
  npm start

  # Run unit test
  npm test
```
>Use `build.sh` to build middleware docker image
>
>Use `run.sh` to run middleware from docker image

Use nginx as a reverse proxy to middleware
```sh
# Generate ssl
pushd network/containers/nginx/ssl && ./generateCert.sh && popd

# Start nginx server
cd network && docker-compose -f containers/nginx.yaml up -d

# If you would like to test nginx loadbalance function, just start another middleware.
pushd ../api && docker-compose -f docker-compose.replica.yaml up -d && popd

# https
curl -k https://localhost:4430

# http
curl http://localhost:8000
```
>Use `-k` to allow self signed ssl cert
