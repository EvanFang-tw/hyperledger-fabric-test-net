docker network create elk-net --attachable

#### Elastic search

elastic search url: `http://localhost:9200/`

default account: *elastic*

default password: *changeme*

#### Filebeat

Will log all docker container logs

#### Kibana

kibana url: `http://localhost:5601`

create filebeat index in kibana: `fabric-*`

---

#### Filebeat config sample

Refs:
- [Condition](https://www.elastic.co/guide/en/beats/filebeat/current/defining-processors.html#conditions)
- [Indices](https://www.elastic.co/guide/en/beats/filebeat/current/elasticsearch-output.html#indices-option-es)

Fetch *ALL* docker log containers' log:
```yaml
filebeat.autodiscover:
  providers:
    - type: docker
      hints.enabled: true
```

Fetch *ALL* Hyperledger log，*EXCLUDE* couchdb log:
```yaml
filebeat.autodiscover:
  providers:
    - type: docker
      templates:
        - condition:
            and:
              - contains:
                  docker.container.image: hyperledger
              - not:
                  contains:
                    docker.container.name: couchdb
          config:
            - type: container
              paths:
                - /var/lib/docker/containers/${data.docker.container.id}/*.log
              exclude_lines: ["^\\s+[\\-`('.|_]"]
              multiline.pattern: ^\[
              multiline.negate: true
              multiline.match: after
```

Make additional index ended with `*-warn` for warning logs, which contains *WARN* in message:
```yaml
setup.template.name: "fabric-%{[agent.version]}"
setup.template.pattern: "fabric-%{[agent.version]}-*"
setup.ilm.enabled: false

output.elasticsearch:
  hosts: elasticsearch.elk:9200
  # This is default index
  index: "fabric-%{[agent.version]}-%{+yyyy.MM.dd}"
  indices:
    # Write log to this index if message contains "WARN".
    - index: "fabric-%{[agent.version]}-%{+yyyy.MM.dd}-warn"
      when.contains:
        message: "WARN"
  username: elastic
  password: changeme
```

---

#### Kibana search commands(KQL)

Ref: https://www.elastic.co/guide/en/kibana/7.6/kuery-query.html

找特定container的log
```
# 找 peer1 log
container.name:"peer1.test.com"

# 找 peer1, couchdb1 log
container.name:("peer1.test.com" OR "couchdb1.test.com")

# 找 peer1 的 FATAL log
"FATA" and container.name:"peer1.test.com"

# "不"列出orderer0 的 log
not container.name:"orderer0.test.com"

# 列出所有orderer的log
container.name:orderer*
```
