# Build stage
FROM rust:alpine AS build
WORKDIR /app
# Install musl-dev to build static binaries
RUN apk add --no-cache musl-dev
COPY . .
RUN cargo build --release

# Runtime stage
FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/target/release/house-temperature-core /app/house-temperature-core
EXPOSE 3000
ENTRYPOINT ["/app/house-temperature-core"]