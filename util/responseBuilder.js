/**
 * @file レスポンスデータを構築する関数群を提供
 * @author neverclear
 */

var responseBuilder = {};

responseBuilder.success = function(data) {
  return {
    result: true,
    detail: data,
  };
}

responseBuilder.error = function(err) {
  return {
    result: false,
    detail: err,
  }
}

module.exports = responseBuilder;
