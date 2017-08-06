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
 * @param  {string} username ユーザ名
 * @param  {string} password パスワード
 * @return {Promise}
 */
user.insert = function(username, password) {
  var db;
  return connectUser(username, password, (d, col) => {
    db = d;
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
 * @param  {string} username ユーザ名
 * @param  {string} password パスワード
 * @return {Promise}
 */
user.auth = function(username, password) {
  var db;
  return connectUser(username, password, (d, col) => {
    db = d;
    return col.find({
      username: username,
      password: hash.createHash(password),
    }).toArray();
  }).then((items) => {
    db.close();
    return items.length == 1;
  })
}

/**
 * パスワード更新
 * @param  {string} username    ユーザ名
 * @param  {string} newPassword 新しいパスワード
 * @return {Promise}
 */
user.updatePassword = function(username, newPassword) {
  var db;
  return connectUser(username, password, (d, col) => {
    db = d;
    return col.updateOne({username: username}, {$set: {password: hash.createHash(newPassword)}});
  }).then((ret) => {
    db.close();
    return ret;
  });
}

/**
 * ユーザを削除する
 * @param  {string} username ユーザ名
 * @param  {string} password パスワード
 * @return {Promise}
 */
user.delete = function(username, password) {
  var db;
  return connectUser(username, password, (d, col) => {
    db = d;
    return col.deleteOne({
      username: username,
      password: hash.createHash(password),
    });
  }).then((ret) => {
    db.close();
    return ret;
  });
}

/**
 * ユーザを検索
 * @param  {string} username ユーザ名
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
/**
 * string型かどうか
 * @param  {Object}  arg 判定する値
 * @return {Boolean}     Stringかどうか
 */
function isString(arg) {
  return typeof arg == "string";
}


/**
 * ユーザへ接続
 * @param  {string}   username ユーザ名
 * @param  {string}   password パスワード
 * @param  {Function} callback 接続後の処理
 * @return {Promise}           
 */
function connectUser(username, password, callback) {
  return new Promise((resolve, reject) => {
    if (isString(username) && isString(password)) {
      client.connect(url, (err, db) => {
        if (err) reject(err);
        resolve(db);
      });
    } else {
      reject(error.InvalidParamsError());
    }
  }).then((db) => {
    var col = db.collection('user');
    return callback(db, col);
  });
}


module.exports = user;
