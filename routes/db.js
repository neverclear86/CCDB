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
            res.json(resBuilder.error());
          }
        });
      } catch (err) {
        if (err instanceof SyntaxError) {
          res.json(resBuilder.error("JSON SyntaxError"));
        } else {
          res.json(resBuilder.error("Error..."));
        }
      }
    } else {
      // 認証失敗
    }
  }).catch((err) => {
    res.json(err);
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
          query = '{}';
        }
        dao.find(JSON.parse(query), req.body.collection, req.body.name)
        .then((result) => {
            res.json(resBuilder.success(result));
        }).catch((err) => {
          throw err;
        });
      } catch (err) {
        console.log(err);
        res.json({err: err.message});
      }
    } else {
      // 認証失敗
    }
  }).catch((err) => {
    res.json(err);
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
          res.json(result);
        }).catch((err) => {
          console.log(err);
          res.json(err);
        });
      } catch (err) {
        res.json(err);
      }
    } else {
      // 認証失敗
    }
  }).catch((err) => {
    res.json(err);
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
            res.json(result);
        }).catch((err) => {
          throw err;
        });
      } catch (err) {
        console.log(err);
        res.json(err);
      }
    } else {
      // 認証失敗
    }
  }).catch((err) => {
    res.json(err);
  });
});



module.exports = router;
