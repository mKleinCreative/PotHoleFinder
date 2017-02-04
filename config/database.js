var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/FindTheHole';
var db = pgp(connectionString);

function getAllUsers(request, response, next) {
  return db.many(' select * from user ')
}

const create = (authsha, lat, lng, label, imageBlob, rating) => {
  return db.one(
    `INSERT INTO
    "user" (authsha, lat, lng, label, rating)
    VALUES
    ( $1, $2, $3, $4, $5 )
    RETURNING id`, [authsha, lat, lng, label, rating]
    )
}

const getAllMarkers = _ => {
  return db.many(
    `SELECT * FROM "user"`
    )
}

module.exports = {
  db,
  create,
  getAllMarkers
}


// db.update( id, position.lat, position.lng, label, 100010101, 5)
