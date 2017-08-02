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
  user.auth(req.query.username, req.query.password)
  .then((result) => {
    res.json(resBuilder.success(result));
  }).catch((err) => {
    console.log(err);
    res.json(resBuilder.error(err));
  });
});


router.post('/insert/', (req, res, next) => {
  var params = req.body;
  new Promise((resolve, reject) => {
    var vResult = validate.required(params, [
      'username', 'password',
    ]);
    if (vResult.length == 0) {
      resolve();
    } else {
      reject(error.FewParamsError(vResult));
    }
  }).then(() => {
    // 同じユーザ名が存在するかを確認
    return user.find(params.username);
  }).then((r) => {
    if (r.length == 0) {
      // 大丈夫そうなら追加
      return user.insert(params.username, params.password);
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
  var params = req.body;
  new Promise((resolve, reject) => {
    var vResult = validate.required(params, [
      'username', 'password', 'newPassword'
    ]);
    if (vResult.length == 0) {
      resolve(params);
    } else {
      reject(error.FewParamsError(vResult));
    }
  }).then((params) => {
    return user.auth(params.username, params.password);
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
  var params = req.body
  Promise.resolve()
  .then(() => {
    var vResult = validate.required(params, [
      'username', 'password', 'newPassword'
    ]);
    if (vResult.length != 0) {
      throw error.FewParamsError(vResult);
    }
  }).then(() => {
    return user.delete(params.username, params.password);
  }).then((result) => {
    res.json(resBuilder.success(result));
  }).catch((err) => {
    res.json(resBuilder.error(err));
  });
});


function validateParam(params) {
  var ret = validate.str([params.username, params.password], [/^\w*$/, /^\w*$/]);
  return ret.indexOf(false) < 0;
}

module.exports = router;
