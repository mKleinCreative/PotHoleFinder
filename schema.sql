

DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  id SERIAL,
  username VARCHAR DEFAULT NULL,
  AuthSHA VARCHAR DEFAULT NULL,
  photo BYTEA DEFAULT NULL,
  lat REAL DEFAULT NULL,
  lng REAL DEFAULT NULL,
  rating INTEGER DEFAULT NULL,
  PRIMARY KEY ("id")
);
-- ---
-- Test Data
-- ---

INSERT INTO "user" ( id, username, AuthSHA, photo, lat, lng, rating ) VALUES ('1','Michael','oz;hadspohgpohdgzs;lhjta;lj','100010101','1242.1245','9876.2345','35');
