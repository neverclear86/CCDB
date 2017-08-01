var validate = {};

validate.required = function(params, required) {
  return required.filter((ele) => {
    return (!params[ele]);
  });
}

validate.str = function(strs, regs) {
  var ret = [];
  regs.forEach((v, i) => {
    ret.push(v.test(strs[i]));
    
  });
  return ret;
}

module.exports = validate;
