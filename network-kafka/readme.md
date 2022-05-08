
Download binaries
```
./bootstrap.sh 1.4.4 1.4.4 0.4.18 -s
```

Run network
```
./start.sh
```

Teardown network
```
./teardown.sh
```

Zookeeper health check:
```
docker exec zookeeper0.test.com ./bin/zkServer.sh status

docker exec zookeeper1.test.com ./bin/zkServer.sh status

docker exec zookeeper2.test.com ./bin/zkServer.sh status
```

Kafka health check:
```
docker exec kafka0.test.com /opt/kafka/bin/kafka-topics.sh --describe --zookeeper zookeeper0.test.com

docker exec kafka1.test.com /opt/kafka/bin/kafka-topics.sh --describe --zookeeper zookeeper1.test.com

docker exec kafka2.test.com /opt/kafka/bin/kafka-topics.sh --describe --zookeeper zookeeper2.test.com

docker exec kafka3.test.com /opt/kafka/bin/kafka-topics.sh --describe --zookeeper zookeeper0.test.com
```