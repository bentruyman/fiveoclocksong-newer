var crypto = require('crypto');

var Q = require('q'),
    check = require('validator').check;

var config = require('../../config'),
    ldapClient = require('../lib/ldap').createClient(),
    logger = require('../lib/logger').createLogger('user model'),
    client = require('../lib/db').createClient();

var PREFIX = 'users';

var User = module.exports = function (data) {
  check(data.name).isAlphanumeric();
  
  this.name = data.name;
  this._namespace = PREFIX + ':' + this.name;
};

// public methods
User.prototype.save = function (callback) {
  client.set(this._namespace + ':name', function (err) {
    if (err) {
      logger.debug('failed to save user: ' + this.name);
      callback(err);
    } else {
      logger.debug('successfully saved user: ' + this.name);
      callback(null);
    }
  });
};

User.prototype.remove = function (callback) {
  var self = this,
      multi = client.multi();
    
    logger.debug('removing user: ' + this.name);
    
    multi
      .del(this._namespace + ':email');
    
    this.getAchievements(function (err, achievements) {
      var promises;
      
      if (err) {
        logger.error('failed to remove user: ' + this.name);
        callback(err);
      } else {
        promises = [];
        
        if (achievements) {
          achievements.forEach(function (achievement) {
            promises.push(Q.ncall(self.removeAchievement, self, achievement));
          });
        }
      }
      
      Q.all(promises).then(
        // successfully removed all achievements
        function () {
          multi.exec(function (err, replies) {
            if (err) {
              logger.error('failed to remove user: ' + this.name);
              callback(err);
            } else {
              logger.debug('successfully removed user: ' + this.name);
              callback();
            }
          });
        },
        // failed to remove all achievements
        function (err) {
          logger.error('failed to remove user: ' + this.name);
          callback(err);
        }
      );
    });
};

User.prototype.getAchievements = function (callback) {
  client.smembers(this._namespace + ':achievements', function (err, achievements) {
    if (err) {
      callback(err);
    } else {
      callback(null, achievements);
    }
  });
};

User.prototype.addAchievement = function (name, callback) {
  logger.debug('adding achievement "' + name + '" for user: ' + this.name);
  
  client.sadd(this._namespace + ':achievements', name, function (err, resp) {
    if (err) {
      logger.error('failed to add achievement "' + name + '" for user: ' + this.name);
      callback(err);
    } else {
      logger.debug('successfully added achievement "' + name + '" for user: ' + this.name);
      callback(null);
    }
  });
};

User.prototype.removeAchievement = function (name, callback) {
  logger.debug('removing achievement "' + name + '" for user: ' + this.name);
  
  client.multi()
    .srem(this._namespace + ':achievements', name)
    .hdel(this._namespace + ':achievementData', name)
    .exec(function (err, replies) {
      if (err) {
        logger.error('failed to remove achievement "' + name + '" for user: ' + this.name);
        callback(err);
      } else {
        logger.debug('successfully removed achievement "' + name + '" for user: ' + this.name);
        callback();
      }
    });
};

User.prototype.getAchievementData = function (name, callback) {
  client.hget(this._namespace + ':achievementdata', name, function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, JSON.parse(data));
      }
    });
};

User.prototype.setAchievementData = function (name, data, callback) {
  client.hset(this._namespace + ':achievementdata', name, JSON.stringify(data), function (err, resp) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
};

User.prototype.getSessionId = function () {
  var shasum = crypto.createHash('sha512');
  
  shasum.update(this.name + config.security.salt);
  
  return shasum.digest('base64');
};

User.prototype.toJSON = function () {
  return {
    name: this.name
  };
};

// static methods
User.create = function (data) {
  return new User(data);
};

User.findByName = function (name, callback) {
  var namespace = PREFIX + ':' + name;
  
  logger.debug('finding user: ' + this.name);
  
  client.get(namespace + ':name', function (err, resp) {
    if (err) {
      logger.error('failed to find user: ' + name);
      callback(err);
    } else if (resp === null) {
      logger.debug('no user found: ' + name);
      callback(null);
    } else {
      logger.debug('found user: ' + name);
      callback(null, User.create({
        name: name
      }));
    }
  });
};

User.login = function (name, password, callback) {
  User.verifyCredentials(name, password, function (err) {
    if (err) {
      callback(err);
    } else {
      User.findByName(name, function (err, user) {
        if (err) {
          callback(err);
        } else if (err === null && !user) {
          callback(null, User.create({ name: name }));
        } else {
          callback(null, user);
        }
      });
    }
  });
};

User.removeByName = function (callback) {
  User.create(name).remove(callback);
};

User.verifyCredentials = function (name, password, callback) {
  if (password.length === 0) {
    callback('No password specified');
  } else {
    ldapClient.bind(name + '@cmass.criticalmass.com', password, function (err, resp) {
      callback(err);
    });
  }
};
