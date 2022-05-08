### Develop in container
```
./scripts/dev.sh
```

### Start middleware
```sh
npm start
```
> Run `npm run dev` to start with nodemon

### Lint
```sh
npm run lint
```

### Unit test
```sh
npm test
```
>Check code coverage report in `coverage` folder

### Build docker image
```sh
./scripts/build.sh
```

### Run / Stop middleware container
```sh
./scripts/run.sh

./scripts/teardown.sh
```

---

### Apis
```sh
# Invoke health check
curl -X POST -H "Content-Type: application/json" -d '{"key" : "key1", "value": "value1" }' "localhost:3000/invoke"

# Query health check
curl localhost:3000/query/key1
```