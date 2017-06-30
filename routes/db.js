/**
 * @file /api/db
 * @author neverclear
 */

const express = require('express');
const router = express.Router();
const user = require('../mongodb/user');
const dao = require('../mongodb/operator');
const resBuilder = require('../util/responseBuilder');

/**
 * /api/db/insert/
 * POST
 * name: ユーザ名
 * password: パスワード
 * collection: コレクション名
 * data: 挿入するドキュメント
 */
router.post('/insert/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      try {
        var data = JSON.parse(req.body.data);
        if (!(data instanceof Array)) {
          data = [data];
        }
        dao.insert(data, req.body.collection, req.body.name)
        .then((result) => {
          if (result) {
            res.json(resBuilder.success(result));
          } else {
            throw new Error('What the fuck')
          }
        });
      } catch (err) {
        throw err;
      }
    } else {
      // 認証失敗
      throw new Error('Login Error');
    }
  }).catch((err) => {
    res.json(resBuilder.error(err.message));
  });
});

router.post('/find/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      var query = req.body.query;
      try {
        if (!query) {
          query = {};
        } else {
          query = JSON.parse(query);
        }
        dao.find(query, req.body.collection, req.body.name)
        .then((result) => {
          if (result.length) {
            res.json(resBuilder.success(result));
          } else {
            throw new Error('No Data');
          }
        }).catch((err) => {
          res.json(resBuilder.error(err.message));
        });
      } catch (err) {
        throw err;
      }
    } else {
      // 認証失敗
      throw new Error("Login Error");
    }
  }).catch((err) => {
    res.json(resBuilder.error(err.message));
  });
});


router.post('/update/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      try {
        var selector = JSON.parse(req.body.selector);
        var data = JSON.parse(req.body.data);
        dao.update(selector, data, req.body.collection, req.body.name)
        .then((result) => {
          res.json(resBuilder.success(result));
        }).catch((err) => {
          res.json(resBuilder.error(err.message));
        });
      } catch (err) {
        throw err;
      }
    } else {
      // 認証失敗
      throw new Error("Login Error");
    }
  }).catch((err) => {
    res.json(resBuilder.error(err.message));
  });
});


router.post('/delete/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      try {
        var filter = JSON.parse(req.body.filter);
        dao.delete(filter, req.body.collection, req.body.name)
        .then((result) => {
            res.json(resBuilder.success(result));
        }).catch((err) => {
          res.json(resBuilder.error(err.message));
        });
      } catch (err) {
        throw err;
      }
    } else {
      // 認証失敗
      throw new Error('Login Error');
    }
  }).catch((err) => {
    res.json(resBuilder.error(err.message));
  });
});



module.exports = router;
