var config = require('../../config'),
    User = require('../models/user');

var UserService = module.exports = {
  createUser: function (data, callback) {
    var user = User.create(data);
    user.save(function (err) {
      if (err) {
        callback(err);
      } else {
        callback(null, user);
      }
    });
  },
  getUserByName: function (name, callback) {
    User.findByName(name, function (err, user) {
      if (err) {
        callback(err);
      } else {
        callback(null, user);
      }
    });
  }
};
