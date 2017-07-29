/**
 *  @file APIを扱うユーザについての操作
 *  @author neverclear
 */

const client = require('mongodb').MongoClient;
const assert = require('assert');

var url = "mongodb://localhost:27017/"

/** ユーザ管理 */
var user = {};

/**
 * ユーザを作成する
 * @param  {Object} data ユーザ情報 ({name:ユーザ名, password:パスワード})
 * @return {Promise}
 */
user.insert = function(data) {
  return new Promise((resolve, reject) => {
    client.connect(url, (err, db) => {
      var col = db.collection('user');
      col.insertOne(data, (err, result) => {
        assert.equal(null, err);
        db.close();
        resolve(result);
      });
    });
  });
}

/**
 * ユーザを認証する
 * @param  {Object} data  認証するユーザデータ
 * @return {Promise}
 */
user.auth = function(data) {
  return new Promise((resolve, reject) => {
    client.connect(url, (err, db) => {
      var col = db.collection('user');
      col.find(data).toArray((err, items) => {
        db.close();
        resolve(items.length == 1);
      });
    });
  });
}


user.updatePassword = function(username, newPassword) {
  return new Promise((resolve, reject) => {
    client.connect(url, (err, db) => {
      var col = db.collection('user');
      resolve(col.updateOne({username: username}, {$set: {password: newPassword}}));
    });
  }).then((ret) => {
    db.close();
    return ret;
  });
}

/**
 * ユーザを削除する
 * @param  {Object} data 削除するユーザのデータ（パスワードあり)
 * @return {Promise}
 */
user.delete = function(data) {
  return new Promise((resolve, reject) => {
    client.connect(url, (err, db) => {
      var col = db.collection('user');
      col.deleteOne(data).then((ret) => {
        db.close();
        resolve(ret);
      });
    });
  });
}

/**
 * ユーザを検索
 * @param  {Object} filter 検索条件
 * @return {Promise}
 */
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

module.exports = user;
