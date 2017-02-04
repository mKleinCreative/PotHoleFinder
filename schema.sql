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
