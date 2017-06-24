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
 * @param  {Object} data       [description]
 * @param  {String} collection [description]
 * @param  {String} user       [description]
 * @return {Promise}           [description]
 */
dao.insert = function(data, collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      col.insert
    });
  });
}

dao.find = function() {

}

module.export = dao;
