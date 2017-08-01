/**
 *
 */

const sechash = require('sechash');

var opt = {
  algorithm: 'sha1',
  iterations: 1024,
  salt: 'test',
  includeMeta: false,
};

var password = {
  createHash: function(password) {
    return sechash.strongHashSync(password, opt);
  },

  isMatch: function(password, hash) {
    return sechash.testHashSync(password, hash, opt);
  },
};

module.exports = password;
