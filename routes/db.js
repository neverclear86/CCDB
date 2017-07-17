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
  var params = req.query;
  login(params, [])
  .then((count) => {
    // コレクションがあるか
    if (count > 0) {
      var query = params.query;
      if (!query) {
        query = {};
      } else {
        query = JSON.parse(query);
      }
      return dao.find(query, params.collection, params.username)
    } else {
      // コレクションが無い
      throw error.NoCollectionError(params.collection);
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
  var params = req.body;
  login(params, ['data'])
  .then(() => {
    var data = JSON.parse(req.body.data);
    if (!(data instanceof Array)) {
      data = [data];
    }
    return dao.insert(data, req.body.collection, req.body.username);
  }).then((result) => {
    if (result) {
      res.json(resBuilder.success(result));
    } else {
      throw new Error('What the fuck')
    }
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
})




router.post('/update/', (req, res, next) => {
  var params = req.body;
  login(params, ['selector', 'data'])
  .then((count) => {
    if (count > 0) {
      var selector = JSON.parse(params.selector);
      var data = JSON.parse(params.data);
      return dao.update(selector, data, params.collection, params.username);
    } else {
      throw error.NoCollectionError(params.collection);
    }
  }).then((result) => {
    res.json(resBuilder.success(result));
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

function login(params, required) {
  return new Promise((resolve, reject) => {
    required.push('username');
    required.push('password');
    required.push('collection');
    var vResult = validate.required(params, required);
    if (vResult.length == 0) {
      resolve(params);
    } else {
      reject(error.FewParamsError(vResult));
    }
  }).then((params) => {
    return user.auth({
      username: params.username,
      password: params.password
    });
  }).then((result) => {
    if (result) {
      return dao.count(params.collection, params.username);
    } else {
      throw error.LoginError();
    }
  });
}


module.exports = router;
