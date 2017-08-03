const mongo = require('../mongo');

function getAll(callback) {
  let db = mongo.db();
  db.collection('inventory').find({}).toArray((err, results) => {
    callback(err, results);
  });
};

function insert(item, callback) {
  let db = mongo.db();
  db.collection('inventory').insert(item, (err, results) => {
    console.log(err, results);
    callback(err, results);
  })
}

module.exports = {getAll, insert};
