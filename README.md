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