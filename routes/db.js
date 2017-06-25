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
      console.log(JSON.parse(req.body.data));
      dao.insert(JSON.parse(req.body.data), req.body.collection, req.body.name)
      .then((result) => {
        if (result) {
          res.json({result: result});
        } else {
          res.json({result:false});
        }
      });
    }
  });
});

router.post('/find/', (req, res, next) => {
  user.auth({
    name: req.body.name,
    password: req.body.password,
  }).then((result) => {
    if (result) {
      dao.find(req.body.query, req.body.collection, req.body.name)
      .then((result) => {
        // if (result) {
          res.json(result);
        // } else {
        // res.json(/{result:false});
        // }
      });
    }
  });
});


module.exports = router;
