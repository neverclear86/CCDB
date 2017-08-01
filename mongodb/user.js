/**
 *  @file APIを扱うユーザについての操作
 *  @author neverclear
 */

const client = require('mongodb').MongoClient;
const assert = require('assert');
const hash   = require('./password');
const error  = require('../util/error');

var url = "mongodb://localhost:27017/"

/** ユーザ管理 */
var user = {};

/**
 * ユーザを作成する
 * @param  {Object} data ユーザ情報 ({name:ユーザ名, password:パスワード})
 * @return {Promise}
 */
user.insert = function(username, password) {
  var db;
  return connectUser(username, password)
  .then((d) => {
    db = d;
    var col = db.collection('user');
    col.insertOne({
      username: username,
      password: hash.createHash(password),
    });
  }).then((result) => {
    db.close();
    return result;
  });
}

/**
 * ユーザを認証する
 * @param  {Object} data  認証するユーザデータ
 * @return {Promise}
 */
user.auth = function(username, password) {
  var db;
  return connectUser(username, password)
  .then((d) => {
    db = d;
    var col = db.collection('user');
    return col.find({
      username: username,
      password: password,
    }).toArray();
  }).then((items) => {
    db.close();
    return items.length == 1;
  });
}


user.updatePassword = function(username, newPassword) {
  var db;
  return connectUser(username, password)
  .then((d) => {
    db = d;
    var col = db.collection('user');
    return col.updateOne({username: username}, {$set: {password: newPassword}});
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
user.delete = function(username, password) {
  var db;
  return connectUser(username, password)
  .then((d) => {
    db = d;
    var col = db.collection('user');
    return col.deleteOne({
      username: username,
      password: password,
    });
  }).then((ret) => {
    db.close();
    return ret;
  });
}

/**
 * ユーザを検索
 * @param  {Object} filter 検索条件
 * @return {Promise}
 */
user.find = function(username) {
  var db;
  return new Promise((resolve, reject) => {
    if (isString(username)) {
      client.connect(url, (err, d) => {
        if (err) reject(err);
        db = d;
        resolve();
      });
    } else {
      reject(error.InvalidParamsError());
    }
  }).then(() => {
    var col = db.collection('user');
    return col.find({username: username}).toArray();
  }).then((items) => {
    db.close();
    return items;
  });
}

//==================================
function isString(arg) {
  return typeof arg == "string";
}

function connectUser(username, password) {
  return new Promise((resolve, reject) => {
    if (isString(username) && isString(password)) {
      client.connect(url, (err, db) => {
        if (err) reject(err);
        resolve(db);
      });
    } else {
      reject(error.InvalidParamsError());
    }
  });
}


module.exports = user;
