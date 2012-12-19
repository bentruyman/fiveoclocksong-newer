var User = require('../models/user');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var rpc = {
    get: function (name) {
      User.findOne({ name: name }, function (err, user) {
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
