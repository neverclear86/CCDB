/**
 * @file データベースをいじるよ
 * @author neverclear
 */

 const client = require('mongodb').MongoClient;
 const assert = require('assert');

 var baseUrl = "mongodb://localhost:27017/"


var dao = {};

/**
 * [description]
 * @param  {Object} data       挿入するデータ
 * @param  {String} collection 挿入先のコレクション
 * @param  {String} user       ユーザ名
 * @return {Promise}
 */
dao.insert = function(data, collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      col.insertMany(data).then((r) => {
        db.close();
        resolve(r.insertedCount);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}



dao.find = function(query, collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      col.find(query).toArray().then((docs) => {
        db.close();
        resolve(docs);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

dao.update = function(selector, docs, collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      col.updateMany(selector, docs).then((r) => {
        db.close();
        resolve(r);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}


dao.delete = function(filter, collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      col.deleteMany(filter).then((r) => {
        db.close();
        resolve(r);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

module.exports = dao;
