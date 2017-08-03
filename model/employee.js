const mongo = require('../mongo');

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

module.exports = { getAll, insert };
