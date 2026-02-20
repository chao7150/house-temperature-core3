# 家居温度記録 API 仕様書

## 1. アプリケーション概要

- **名称**: house-temperature-core
- **用途**: 家の温度・湿度・気圧を測定・記録する REST API
- **現 Tech Stack**: Node.js + Express + Prisma + PostgreSQL
- **移植先**: Spring Boot + Spring Data JPA + PostgreSQL

## 2. 機能仕様

### 2.1 API エンドポイント

| Method | Path               | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/temperature` | 気象データの登録               |
| GET    | `/api/temperature` | 気象データの取得（期間指定可） |
| GET    | `/status`          | ヘルスチェック                 |

### 2.2 POST `/api/temperature`

- **認証**: `X-Temppost-Password` ヘッダー（環境変数`TEMPPOST_PASSWORD`と照合）
- **Request Body**:

```json
{
  "datetime": 1708400000000,
  "temperature": 22.0,
  "humidity": 49.1,
  "pressure": 1022.5
}
```

- **Response**: 登録されたデータを JSON で返す
- **エラー**: 400 (不正なボディ), 401 (認証エラー)

### 2.3 GET `/api/temperature`

- **Query Parameters** (すべて任意):
  - `start`: 取得開始日時（ISO 8601 形式、デフォルト: 本日 0 時 0 分）
  - `end`: 取得終了日時（デフォルト: 明日 0 時 0 分）
- **Response**: `datetime`升順で配列 반환

### 2.4 GET `/status`

- **Response**: `{ "status": "OK" }`

## 3. データベース設計

### Table: `Weather`

| Column      | Type         | Constraints |
| ----------- | ------------ | ----------- |
| datetime    | TIMESTAMP    | PRIMARY KEY |
| temperature | REAL (Float) | NOT NULL    |
| humidity    | REAL (Float) | NOT NULL    |
| pressure    | REAL (Float) | NOT NULL    |

## 4. 環境変数

| Variable          | Description                       | 例                                              |
| ----------------- | --------------------------------- | ----------------------------------------------- |
| DATABASE_URL      | PostgreSQL 接続文字列             | `postgresql://user:pass@localhost:5432/weather` |
| TEMPPOST_PASSWORD | POST API 用パスワード             | `test`                                          |
| SERVER_PORT       | サーバーポート（デフォルト 3000） | `3000`                                          |

## 5. プロジェクト構成（Spring Boot）

```
src/main/java/com/example/houseTemperature/
├── HouseTemperatureApplication.java
├── controller/
│   └── TemperatureController.java
├── entity/
│   └── Weather.java
├── repository/
│   └── WeatherRepository.java
├── service/
│   └── TemperatureService.java
└── config/
    └── CorsConfig.java
```

## 6. テスト仕様

- POST 成功時のステータスコード確認
- パスワード誤り時に 401 返す
- 期間指定でのデータ取得確認
- ヘルスチェック確認
