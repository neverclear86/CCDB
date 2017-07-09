var validate = {};

validate.require = function(req, params) {
  return params.filter((ele) => {
    return (!req.hasOwnProperty(ele));
  });
}

module.exports = validate;
