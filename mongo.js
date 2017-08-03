const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let database = null;

function connect(url, callback) {
  // IF WE HAVE ALREADY CONNECTED, DON'T DO IT AGAIN
  if (database !== null) {
    return database;
  }
  mongoClient.connect(url, function(err, db) {
    database = db;
    callback();
  })
}

function db() {
  return database;
}

module.exports = {connect, db, ObjectID};
