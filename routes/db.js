/**
 * @file /api/db
 * @author neverclear
 */

const express = require('express');
const router = express.Router();
const user = require('../mongodb/user');
const dao = require('../mongodb/operator');
const resBuilder = require('../util/responseBuilder');
const error = require('../util/error');
const validate = require('../util/validate');

/**
 * 検索する
 * /api/db/find/
 * GET
 * @param {String} username   ユーザ名
 * @param {String} password   パスワード
 * @param {String} collection コレクション名
 * @param {Object} query      検索条件
 */
router.get('/find/', (req, res, next) => {
  var vResult = validate.require(req.query, [
    'username', 'password', 'collection',
  ]);
  if (vResult.length == 0) {
    var username = req.query.username;
    var collection = req.query.collection;
    user.auth({
      username: username,
      password: req.query.password,
    }).then((result) => {
      // ユーザ認証
      if (result) {
        return dao.count(collection, username);
      } else {
        // 認証失敗
        throw error.LoginError();
      }
    }).then((count) => {
      // コレクションがあるか
      if (count > 0) {
        var query = req.query.query;
        if (!query) {
          query = {};
        } else {
          query = JSON.parse(query);
        }
        return dao.find(query, collection, username)
      } else {
        // コレクションが無い
        throw error.NoCollectionError(collection);
      }
    }).then((result) => {
      // データがあるか
      if (result.length) {
        // 正常
        res.json(resBuilder.success(result));
      } else {
        // データが無い
        throw error.NoDataError();
      }
    }).catch((err) => {
      res.json(resBuilder.error(err));
    });
  } else {
    res.json(resBuilder.error(error.FewParamsError(vResult)));
  }
});


/**
 * 挿入する
 * /api/db/insert/
 * POST
 * @param {String} username   ユーザ名
 * @param {String} password   パスワード
 * @param {String} collection コレクション名
 * @param {Object} data       挿入するドキュメント
 */
router.post('/insert/', (req, res, next) => {
  user.auth({
    username: req.body.username,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      var data = JSON.parse(req.body.data);
      if (!(data instanceof Array)) {
        data = [data];
      }
      dao.insert(data, req.body.collection, req.body.username)
      .then((result) => {
        if (result) {
          res.json(resBuilder.success(result));
        } else {
          throw new Error('What the fuck')
        }
      });
    } else {
      // 認証失敗
      throw error.LoginError();
    }
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});




router.post('/update/', (req, res, next) => {
  user.auth({
    username: req.body.username,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      // try {
      var selector = JSON.parse(req.body.selector);
      var data = JSON.parse(req.body.data);
      dao.update(selector, data, req.body.collection, req.body.username)
      .then((result) => {
        res.json(resBuilder.success(result));
      }).catch((err) => {
        res.json(resBuilder.error(err));
      });
    } else {
      // 認証失敗
      throw error.LoginError();
    }
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});


router.post('/delete/', (req, res, next) => {
  user.auth({
    username: req.body.username,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      var filter = JSON.parse(req.body.filter);
      dao.delete(filter, req.body.collection, req.body.username)
      .then((result) => {
          res.json(resBuilder.success(result));
      }).catch((err) => {
        res.json(resBuilder.error(err));
      });
    } else {
      // 認証失敗
      throw error.LoginError();
    }
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});



module.exports = router;
