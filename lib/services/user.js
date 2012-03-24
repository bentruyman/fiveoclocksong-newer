var config = require('../../config'),
    User = require('../domain/user');

var nano = require('nano')(config.database.url),
    db = nano.use(config.database.name);

var UserService = module.exports = {
  createUser: function (data, callback) {
    var user = new User(data);
  },
  getUserByName: function (name, callback) {
    db.view('users', 'byName', { key: name }, function (err, resp) {
      if (err) {
        callback(err);
      } else {
        if (resp.rows.length !== 1) {
          callback(null, null);
        } else {
          callback(null, new User(resp.rows[0].value));
        }
      }
    });
  }
};
