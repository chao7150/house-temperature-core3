# 家居温度記録 API 仕様書

## 1. アプリケーション概要

- **名称**: house-temperature-core
- **用途**: 家の温度・湿度・気圧を測定・記録する REST API
- **Tech Stack**: Rust + Axum + SQLx + PostgreSQL

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
- **仕様詳細**:
  - `datetime`: タイムスタンプ（ミリ秒）。整数値の他、浮動小数点数での入力も許容し、内部で適切に処理する。
  - `temperature`, `humidity`, `pressure`: 数値（数値型または文字列型）。内部で倍精度浮動小数点数として解釈される。
- **Response**: 登録されたデータを JSON で返す
- **エラー**:
  - **401 (Unauthorized)**:
    ```json
    { "title": "incorrect password", "detail": "Password is incorrect." }
    ```
  - **400 (Bad Request)**:
    ```json
    { "title": "request body is invalid", "detail": "Request body must contain datetime, temperature, humidity and pressure." }
    ```

### 2.3 GET `/api/temperature`

- **Query Parameters** (すべて任意):
  - `start`: 取得開始日時（ISO 8601 形式。オフセットがない場合は UTC とみなす。デフォルト: 本日 0 時 0 分 UTC）
  - `end`: 取得終了日時（ISO 8601 形式。デフォルト: `start` の 24 時間後）
- **Response**: `datetime` 昇順で配列を返す

### 2.4 GET `/status`

- **Response**: `{ "status": "OK" }`

### 2.5 CORS 設定

- すべてのオリジン (`*`) を許可
- 許可メソッド: `GET`, `POST`, `OPTIONS`
- 許可ヘッダー: すべて (`*`)

## 3. データベース設計

### Table: `Weather`

| Column      | Type                     | Constraints |
| ----------- | ------------------------ | ----------- |
| datetime    | TIMESTAMP WITH TIME ZONE | PRIMARY KEY |
| temperature | DOUBLE PRECISION         | NOT NULL    |
| humidity    | DOUBLE PRECISION         | NOT NULL    |
| pressure    | DOUBLE PRECISION         | NOT NULL    |

## 4. 環境変数

| Variable          | Description                       | 例                                              |
| ----------------- | --------------------------------- | ----------------------------------------------- |
| DATABASE_URL      | PostgreSQL 接続文字列             | `postgresql://user:pass@localhost:5432/weather` |
| TEMPPOST_PASSWORD | POST API 用パスワード             | `test`                                          |
| SERVER_PORT       | サーバーポート（デフォルト 3000） | `3000`                                          |

## 5. 実装に関する技術詳細

- **タイムゾーン**: すべて内部処理および時刻計算は UTC を使用する。
- **データ型**: 数値は倍精度浮動小数点数 (`f64`) を使用。
