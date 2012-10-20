var userService = require('../services/user');

module.exports.actions = function (req, res, ss) {
  return {
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
};
