var userService = require('../services/user');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var rpc = {
    get: function (username) {
      userService.getUserByName(username, function (err, user) {
        if (err) {
          res(false);
        } else {
          res(user);
        }
      });
    }
  };
  
  return rpc;
};
