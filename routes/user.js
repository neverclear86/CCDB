/**
 *  @file /api/user
 *  DBを扱うユーザの認証
 *  @author neverclear
 */


var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');

router.get('/', (req, res, next) => {
  user.auth({
    name: req.query.name,
    password: req.query.password,
  }).then((result) => {
    res.json({
      result: result,
    });
  });
});


module.exports = router;
