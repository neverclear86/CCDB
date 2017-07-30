var validate = {};

validate.required = function(params, required) {
  return required.filter((ele) => {
    return (!params[ele]);
  });
}

module.exports = validate;
