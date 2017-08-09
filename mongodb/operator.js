/**
 * @file データベースをいじるよ
 * @author neverclear
 */

 const client = require('mongodb').MongoClient;
 const assert = require('assert');

 var baseUrl = "mongodb://localhost:27017/"


var dao = {};

/**
 * データ挿入
 * @param  {object} data       挿入するデータ
 * @param  {string} collection 挿入先のコレクション
 * @param  {string} user       ユーザ名
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


/**
 * 検索する
 * @param  {object} query      検索条件
 * @param  {string} collection コレクション名
 * @param  {string} user       ユーザ名
 * @return {Promise}           検索結果を返却
 */
dao.find = function(query, collection, user, options) {
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


/**
 * 更新する
 * @param  {object} selector    検索条件
 * @param  {object} docs        更新するデータ
 * @param  {string} collection  コレクション名
 * @param  {string} user        ユーザ名
 * @param  {object} opt         オプション {upsert: boolean, one: boolean}
 * @return {Promise}            更新結果を返却
 */
dao.update = function(selector, docs, collection, user, opt) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      var update;
      if (opt.one == true) {
        update = col.updateOne(selector, docs, {upsert: opt.upsert == true});
      } else {
        update = col.updateMany(selector, docs, {upsert: opt.upsert == true});
      }
      update.then((r) => {
        db.close();
        resolve(r);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

/**
 * 削除する
 * @param  {object} filter     検索条件
 * @param  {string} collection コレクション名
 * @param  {string} user       ユーザ名
 * @return {Promise}           削除結果を返却
 */
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

/**
 * コレクション内のドキュメント数を取得
 * @param  {string} collection コレクション名
 * @param  {string} user       ユーザ名
 * @return {Promise}           ドキュメント数を返却
 */
dao.count = function(collection, user) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + user;
    client.connect(url, (err, db) => {
      var col = db.collection(collection);
      resolve(col.count());
    });
  });
}

module.exports = dao;
