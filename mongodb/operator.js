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
 * @param  {[type]} data       [description]
 * @param  {[type]} collection [description]
 * @param  {[type]} user       [description]
 * @param  {[type]} pass       [description]
 * @return {[type]}            [description]
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
