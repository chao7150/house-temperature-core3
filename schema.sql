CREATE TABLE "public"."Weather" (
  datetime TIMESTAMP PRIMARY KEY NOT NULL,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  pressure REAL NOT NULL
);