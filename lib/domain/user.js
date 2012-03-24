var crypto = require('crypto'),
    _ = require('underscore');

var config = require('../../config');

var User = module.exports = function (data) {
  _.extend(this, { achievements: [] }, data);
};

// force user type
Object.defineProperty(User.prototype, 'type', {
  value: 'user',
  writable: false
});

// hash all passwords
Object.defineProperty(User.prototype, 'password', {
  set: function (password) {
    return crypto
      .createHash('sha512')
      .update(config.security.salt + password, 'utf8')
      .digest('base64');
  }
});

User.prototype.toJSON = function () {
  var user = {};
  
  if (this._id)  { user._id  = this._id; }
  if (this._rev) { user._rev = this._rev; }
  
  user.name         = this.name;
  user.email        = this.email;
  user.password     = this.password;
  user.achievements = this.achievements;
  
  return user;
};

User.prototype.toSecuredJSON = function () {
  var user = User.prototype.toJSON.call(this);
  
  delete user._id;
  delete user._rev;
  delete user.password;
  
  return user;
};
