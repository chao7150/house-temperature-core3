use axum::{
    extract::{Query, State},
    http::{StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use chrono::{DateTime, Utc, TimeZone};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPool, FromRow};
use std::env;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone, FromRow, Serialize, Deserialize, Debug)]
struct Weather {
    datetime: DateTime<Utc>,
    temperature: f64,
    humidity: f64,
    pressure: f64,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/temperature", post(post_temperature).get(get_temperature))
        .route("/status", get(status))
        .layer(cors)
        .with_state(pool);

    let port = env::var("SERVER_PORT").unwrap_or_else(|_| "3000".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn post_temperature(
    State(pool): State<PgPool>,
    headers: axum::http::HeaderMap,
    Json(payload): Json<serde_json::Value>,
) -> impl IntoResponse {
    let password = headers.get("X-Temppost-Password").and_then(|v| v.to_str().ok());
    if password != Some(&env::var("TEMPPOST_PASSWORD").unwrap_or_default()) {
        return (StatusCode::UNAUTHORIZED, Json(serde_json::json!({
            "title": "incorrect password",
            "detail": "Password is incorrect."
        }))).into_response();
    }

    let datetime_ms = payload["datetime"].as_i64();
    let temp = payload["temperature"].as_f64();
    let hum = payload["humidity"].as_f64();
    let press = payload["pressure"].as_f64();

    if datetime_ms.is_none() || temp.is_none() || hum.is_none() || press.is_none() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({
            "title": "request body is invalid",
            "detail": "Request body must contain datetime, temperature, humidity and pressure."
        }))).into_response();
    }

    let weather = Weather {
        datetime: Utc.timestamp_millis_opt(datetime_ms.unwrap()).unwrap(),
        temperature: temp.unwrap(),
        humidity: hum.unwrap(),
        pressure: press.unwrap(),
    };

    sqlx::query("INSERT INTO weather (datetime, temperature, humidity, pressure) VALUES ($1, $2, $3, $4)")
        .bind(weather.datetime)
        .bind(weather.temperature)
        .bind(weather.humidity)
        .bind(weather.pressure)
        .execute(&pool)
        .await
        .unwrap();

    Json(weather).into_response()
}

#[derive(Deserialize)]
struct GetQuery {
    start: Option<String>,
    end: Option<String>,
}

async fn get_temperature(
    State(pool): State<PgPool>,
    Query(query): Query<GetQuery>,
) -> impl IntoResponse {
    let start = query.start.and_then(|s| s.parse::<DateTime<Utc>>().ok())
        .unwrap_or_else(|| Utc::now().date_naive().and_hms_opt(0, 0, 0).unwrap().and_utc());
    let end = query.end.and_then(|s| s.parse::<DateTime<Utc>>().ok())
        .unwrap_or_else(|| start + chrono::Duration::days(1));

    let results = sqlx::query_as::<_, Weather>("SELECT * FROM weather WHERE datetime BETWEEN $1 AND $2 ORDER BY datetime ASC")
        .bind(start)
        .bind(end)
        .fetch_all(&pool)
        .await
        .unwrap();

    Json(results).into_response()
}

async fn status() -> impl IntoResponse {
    Json(serde_json::json!({ "status": "OK" }))
}
