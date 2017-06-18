const client = require('mongodb').MongoClient;
const assert = require('assert');

var url = "mongodb://localhost:27017/testuser"

var user = {};
user.create = function(data) {
  client.connect(url, (err, db) => {
    var col = db.collection('user');
    col.insert(data, (err, result) => {
      assert.equal(null, err);
      db.close();
    });

  });
}

user.auth = function() {

}

user.remove = function() {

}

user.find = function(filter) {
  return new Promise((resolve, reject) =>{
    client.connect(url, (err, db) => {
      var col = db.collection('user');
      col.find(filter).toArray((err, items) => {
        resolve(items);
        db.close();
      });
    });
  });
}

//==================================
function connect() {
  client.connect(url, (err, db) => {

  });
}

module.exports = user;
