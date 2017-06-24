var fs = require("fs");
var path = require("path");
var dir = process.argv[2] || '.'; //引数が無いときはカレントディレクトリを対象とする

var walk = function(p, fileCallback, errCallback) {
  fs.readdir(p, function(err, files) {
    if (err) {
      errCallback(err);
      return;
    }
    files.forEach(function(f) {
      var fp = path.join(p, f); // to full-path
      if(fs.statSync(fp).isDirectory()) {
        walk(fp, fileCallback); // ディレクトリなら再帰
      } else {
        fileCallback(fp); // ファイルならコールバックで通知
      }
    });
  });
};

module.exports = walk;
