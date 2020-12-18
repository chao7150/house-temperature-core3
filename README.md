# house-temperature-core3

## development

```bash
cp .env.sample .env
yarn
yarn prisma generate
yarn start:db
psql -h localhost -U prisma -d weather -f schema.sql
yarn debug
```

## deployment

```bash
cp .env.sample .env
docker-compose up -d db
psql -h localhost -U prisma weather -f schema.sql
docker-compose up -d web
```