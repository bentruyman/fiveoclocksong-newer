var User = require('../models/user');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var rpc = {
    login: function (username, password) {
      User.login(username, password, function (err, user) {
        if (user) {
          req.session.setUserId(user.name);
          
          req.session.loggedIn = true;
          req.session.username = user.name;
          
          req.session.save(function (err) {
            if (!err) {
              res(user);
            } else {
              res(false);
            }
          });
        } else {
          res(false);
        }
      });
    },
    logout: function () {
      ss.publish.user(req.session.userId, '/logout');
      
      req.session.destroy(function (err) {
        if (!err) {
          res(true);
        } else {
          res(false);
        }
      });
    },
    restoreSession: function () {
      var sesh = formatSession(req.session);
      
      if (sesh) {
        ss.publish.user(req.session.userId, '/login', sesh);
        res(sesh);
      } else {
        res(false);
      }
    }
  };
  
  return rpc;
};

function formatSession(s) {
  return !s.loggedIn ? null : {
    name: s.username
  };
}
