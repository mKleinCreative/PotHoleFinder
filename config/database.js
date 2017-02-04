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

const create = (authsha, lat, lng, label, rating) => {
  return db.oneOrNone(
    `INSERT INTO
    "user"(authsha, lat, lng, label, rating)
    VALUES
    ( $1, $2, $3, $4, $5 )
    RETURNING id`, [authsha, lat, lng, label, rating]
    )
    // .then( data => {
    //   console.log("I got here, ", data)
    // })
}

const getAllMarkers = () => {
  // console.log("About to get those markers")
  return db.manyOrNone('select * from "user"')
}

const update = (id, rating) => {
  return db.oneOrNone(
    `UPDATE
    "user"
    SET
    rating=$2
    WHERE id=$1`, [ id, rating ]
    )
}

const deleteItem = id => {
  return db.oneOrNone(
    `DELETE FROM
    "user"
    WHERE id=$1`, [ id ]
    )
}

module.exports = {
  db,
  create,
  getAllMarkers,
  update,
  deleteItem
}


// db.update( id, position.lat, position.lng, label, 100010101, 5)
