/**
 * @file /api/user-insert (POST)
 *       ユーザを作成する
 * @author neverclear
 */

var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');


router.post('/', (req, res, next) => {
  var data = {
    username: req.body.username,
    password: req.body.password,
  };
  // 同じユーザ名が存在するかを確認
  user.find({username:req.body.username})
  .then((r) => {
    if (r.length == 0) {
      // 大丈夫そうなら追加
      user.insert(data)
      .then((result) => {
        res.json({result: result});
      });
    } else {
      res.json({result: false});
    }
  }).catch((err) => {
    res.json({result: false});
  });
});

module.exports = router;
