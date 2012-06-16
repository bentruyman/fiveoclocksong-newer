var crypto = require('crypto');

var Q = require('q'),
    check = require('validator').check;

var config = require('../config'),
    logger = require('../core/log').getLogger('user model'),
    Db = require('../lib/db'),
    client = new Db;

var PREFIX = 'users';

var User = module.exports = function (data) {
  check(data.name).isAlphanumeric();
  check(data.email).isEmail();
  check(data.password).len(4);
  
  this.name = data.name;
  this.email = data.email;
  this.password = data.password;
  this._namespace = PREFIX + ':' + this.name;
};

Object.defineProperty(User.prototype, 'password', {
  get: createPasswordHash
});

// public methods
User.prototype.save = function (callback) {
  var multi = client.multi()
    .set(this._namespace + ':email', this.email)
    .set(this._namespace + ':password', this.password);
  
  logger.debug('saving user: ' + this.name);
  
  multi.exec(function (err, replies) {
    if (err) {
      logger.error('failed to save user: ' + this.name);
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
      .del(namespace + ':email')
      .del(namespace + ':password');
    
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

User.prototype.toJSON = function () {
  return {
    name: this.name,
    email: this.email
  };
};

// static methods
User.create = function (data) {
  return new User(data);
};

User.findByName = function (name, callback) {
  var namespace = PREFIX + ':' + name;
  
  logger.debug('finding user: ' + this.name);
  
  client.multi()
    .get(namespace + ':email')
    .get(namespace + ':password')
    .smembers(namespace + ':achievements')
    .exec(function (err, replies) {
      if (err) {
        logger.error('failed to find user: ' + this.name);
        callback(err);
      } else {
        logger.debug('found user: ' + name);
        callback(null, User.create({
          name: name,
          email: replies[0],
          password: replies[1],
          achievements: replies[2]
        }));
      }
    });
};

User.removeByName = function (callback) {
  User.create(name).remove(callback);
};

User.verifyCredentials = function (name, password, callback) {
  var namespace = PREFIX + ':' + name,
      testHash = createPasswordHash(password);
  
  client.get(namespace + ':password', function (err, realHash) {
    if (err) {
      callback(err);
    } else {
      if (testHash === realHash) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
};

// private functions
function createPasswordHash(value) {
  return crypto.createHash('sha256').update(config.security.salt + value).digest('base64');
}
