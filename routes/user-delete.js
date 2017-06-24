/**
 * @file /api/user-delete (POST)
 *       ユーザを削除する
 * @author neverclear
 */

var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');


router.post('/', (req, res, next) => {
  var data = {
    name: req.body.name,
    password: req.body.password,
  };
  user.delete(data).then((result) => {
    res.json({result: result});
  });
});

module.exports = router;
