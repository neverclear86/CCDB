var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user = require('../mongodb/user');
  // user.create({name: "testman2", password: "1234"});
  user.find({}).then((data) => {
    console.log(data.length);
    res.json(data);
  });

});

module.exports = router;
