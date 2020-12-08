```
psql -h localhost -U prisma -d weather -f schema.sql
yarn prisma introspect
```

```
curl -X POST -H "Content-Type: application/json" -H "X-Temppost-Password: test" -d '{"datetime":1607263720155,"temperature": 22.0041086409, "humidity": 49.1351015079, "pressure": 1022.50175382}' localhost:3000/api/temperature
```
