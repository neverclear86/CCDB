/**
 *
 */

var err = function(name, message) {
  var error = new Error(message);
  error.name = name;
  return error;
}

err.FewParamsError = function(params) {
  return err("FewParamsError", "Few param : " + params);
}

err.LoginError = function() {
  return err("LoginError", "The username or password you entered is incorrect.");
}

err.NoDataError = function() {
  return err("NoDataError", "Nothing Data.");
}

err.NoCollectionError = function(collection) {
  return err("NoCollectionError", "Nothing Collection : " + collection);
}

err.InvalidUsernameError = function() {
  return err("InvalidUsernameError", "Your username is invalid.");
}

err.InvalidParamsError = function() {
  return err("InvalidParamsError", "Parameter is invalid");
}

module.exports = err;
