/**
 * @file /api/db
 * @author neverclear
 */

const express = require('express');
const router = express.Router();
const user = require('../mongodb/user');
const dao = require('../mongodb/operator');

router.post('/insert/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      // console.log(JSON.parse(req.body.data));
      try {
        dao.insert(JSON.parse(req.body.data), req.body.collection, req.body.name)
        .then((result) => {
          if (result) {
            res.json({result: result});
          } else {
            res.json({result:false});
          }
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
            res.json(result);
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
