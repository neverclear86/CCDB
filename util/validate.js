var validate = {};

validate.required = function(req, params) {
  return params.filter((ele) => {
    return (!req.hasOwnProperty(ele));
  });
}

module.exports = validate;
