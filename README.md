# house-temperature-core3

## development

```bash
cp .env.sample .env
# DBを起動
docker compose up -d db
# アプリをローカルで起動 (Mavenが必要)
mvn spring-boot:run
```

## deployment

1. リモートサーバー (`sakura`) にログイン
2. `~/src/house-temperature-core3` に移動
3. `.env` の修正 (特に JDBC URL)
4. ビルドと起動

```bash
git pull origin master
docker compose up -d --build
```