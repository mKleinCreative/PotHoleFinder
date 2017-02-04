var promise = require('bluebird');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/skunk-todo';
var db = pgp(connectionString);

function getAllUsers(request, response, next) {
  return db.many(' select * from user ')
}
