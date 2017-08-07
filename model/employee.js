const mongo = require('../mongo');
const ObjectID = require('mongodb').ObjectID;

function getAll(callback) {
  let db = mongo.db();
  db.collection('employees').find({}).toArray((err, results) => {
    callback(err, results);
  });
};

function insert(employee, callback) {
  let db = mongo.db();
  db.collection('employees').insert(employee, (err, results) => {
    callback(err, results);
  });
};

function findOne(itemId, callback) {
  let db = mongo.db();
  db.collection('employees').findOne(itemId, (err, results) => {
    callback(err, results);
  });
};

function update(itemId, editedItem, callback) {
  let db = mongod.db();
  db.collection('employees').update({ "_id": ObjectID(itemId) }, { $set: editedEmployee }, (err, result) => {
    callback(err, result);
  });
};

module.exports = { getAll, insert, findOne, update };
