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
    username: req.query.username,
    password: req.query.password,
  }).then((result) => {
    res.json({
      result: result,
    });
  });
});


router.post('/insert/', (req, res, next) => {
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


router.post('/update/', (req, res, next) => {
  new Promise((resolve, reject) => {
    var params = req.body;
    var vResult = validate.required(params, {
      'username', 'password', 'newPassword'
    });
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
      return user.updatePassword(params.username, params.newPassword);
    } else {
      throw error.LoginError();
    }
  }).then((resutl) => {
    
  });
});


router.post('/delete/', (req, res, next) => {
  var data = {
    username: req.body.username,
    password: req.body.password,
  };
  user.delete(data).then((result) => {
    res.json({result: result});
  });
});

module.exports = router;
