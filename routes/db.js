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

/**
 * 変更する
 * /api/db/update/
 * POST
 */
router.post('/update/', (req, res, next) => {
  console.log(req.url.split('/')[2]);
  var params = req.body;
  login(params, ['selector', 'data'])
  .then((count) => {
    if (count > 0) {
      var selector = JSON.parse(params.selector);
      var data = JSON.parse(params.data);
      return dao.update(
        selector,
        data,
        params.collection,
        params.username,
        {upsert: params.upsert == 'true', one: params.one == 'true'}
      );
    } else {
      throw error.NoCollectionError(params.collection);
    }
  }).then((result) => {
    res.json(resBuilder.success(result));
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});

/**
 * 削除する
 * /api/db/delete/
 * POST
 */
router.post('/delete/', (req, res, next) => {
  var params = req.body;
  login(params, ['filter'])
  .then(function(count) {
    if (count > 0) {
      var filter = JSON.parse(req.body.filter);
      return dao.delete(filter, req.body.collection, req.body.username);
    } else {
      throw error.NoCollectionError(params.collection);
    }
  }).then((result) => {
    res.json(resBuilder.success(result));
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});


/**
 * DB操作前処理
 * @param  {Object.<string>} params   リクエストボディ
 * @param  {Array.<string>}  required 必須リクエストパラメータ名
 *                                    (username,password,collectionを除く)
 * @return {Promise}  指定したCollectionのデータ件数
 */
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
