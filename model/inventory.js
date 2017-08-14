const mongo = require('../mongo');
const ObjectID = require('mongodb').ObjectID;

function getAll(callback) {
  let db = mongo.db();
  db.collection('inventory').find({}).toArray((err, results) => {
    callback(err, results);
  });
};

function insert(item, callback) {
  let db = mongo.db();
  item.dateCreated = new Date().toDateString();
  db.collection('inventory').insert(item, (err, results) => {
    console.log(err, results);
    callback(err, results);
  });
};

function findOne(itemId, callback) {
  let db = mongo.db();
  db.collection('inventory').findOne(itemId, (err, results) => {
    callback(err, results);
  });
};

function update(itemId, newItem, callback) {
  let db = mongo.db();
  db.collection('inventory').update({'_id': ObjectID(itemId)}, {$set: newItem}, (err, results) => {
    callback(err, results);
  });
};

module.exports = { getAll, insert, findOne, update };
