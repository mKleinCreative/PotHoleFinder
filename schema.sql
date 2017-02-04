DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR DEFAULT NULL,
  AuthSHA VARCHAR DEFAULT NULL,
  photo BYTEA DEFAULT NULL,
  lat REAL DEFAULT NULL,
  lng REAL DEFAULT NULL,
  label VARCHAR DEFAULT NULL,
  rating INTEGER DEFAULT NULL
);
-- ---
-- Test Data
-- ---

INSERT INTO "user" ( username, AuthSHA, photo, lat, lng, rating ) VALUES ('Michael','oz;hadspohgpohdgzs;lhjta;lj','100010101','1242.1245','9876.2345','35');

DROP TABLE IF EXISTS "session";

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
