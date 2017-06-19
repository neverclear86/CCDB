/**
 *  /api/user
 *  DBを利用するユーザについての操作
 *  @author neverclear
 */


var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');

/**
 *  GET
 *  Find user.
 */
router.get('/', (req, res, next) => {
  user.find({
    name: req.query.name,
  }).then((data) => {
    console.log(data.length);
    res.json({
      result: data.length > 0,
    });
  });
});

/**
 *  POST
 *  Insert user.
 */
router.post('/', (req, res, next) => {
  var data = {
    name: req.body.name,
    password: req.body.password,
  };
  user.create(data);
  // .then((result) => {
  //   res.json({result: result});
  // });
  res.json({result:true});
});

module.exports = router;
