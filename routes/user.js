/**
 *  @file /api/user
 *  DBを扱うユーザの認証
 *  @author neverclear
 */


var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');
const resBuilder = require('../util/responseBuilder');
const error = require('../util/error');
const validate = require('../util/validate');

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
  new Promise((resolve, reject) => {
    console.log(req.query);
    console.log(req.headers);
    var params = req.body;
    var vResult = validate.required(params, [
      'username', 'password',
    ]);
    if (vResult.length == 0) {
      resolve(params);
    } else {
      reject(error.FewParamsError(vResult));
    }
  }).then((params) => {
    // 同じユーザ名が存在するかを確認
    return user.find({username:req.body.username});
  }).then((r) => {
    if (r.length == 0) {
      // 大丈夫そうなら追加
      return user.insert({
        username: params.username,
        password: params.password,
      });
    } else {
      throw error.InvalidUsernameError();
    }
  }).then((result) => {
    res.json(resBuilder.success(result));
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});


router.post('/update/', (req, res, next) => {
  new Promise((resolve, reject) => {
    var params = req.body;
    var vResult = validate.required(params, [
      'username', 'password', 'newPassword'
    ]);
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
    res.json(resBuilder.success(result));
  }).catch((err) => {
    res.json(resBuilder.error(err));
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
