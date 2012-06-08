var crypto = require('crypto');

var Q = require('q'),
    check = require('validator').check;

var config = require('../config'),
    db = require('../lib/db'),
    client = db.client;

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
  
  multi.exec(function (err, replies) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

User.prototype.remove = function (callback) {
  var self = this,
      multi = client.multi();
    
    multi
      .del(namespace + ':email')
      .del(namespace + ':password');
    
    this.getAchievements(function (err, achievements) {
      var promises;
      
      if (err) {
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
              callback(err);
            } else {
              callback();
            }
          });
        },
        // failed to remove all achievements
        function (err) {
          callback(err);
        }
      );
    });
};

User.prototype.getAchievements = function (callback) {
  client.smembers(this._namespace + ':achievements', function (err, achievements) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, achievements);
    }
  });
};

User.prototype.addAchievement = function (name, callback) {
  client.sadd(this._namespace + ':achievements', name, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

User.prototype.removeAchievement = function (name, callback) {
  client.multi()
    .srem(this._namespace + ':achievements', name)
    .hdel(this._namespace + ':achievementData', name)
    .exec(function (err, replies) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
};

User.prototype.getAchievementData = function (name, callback) {
  client.hget(this._namespace + ':achievementdata', name, function (err, data) {
      if (err) {
        callback(err, null);
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
  
  client.multi()
    .get(namespace + ':email')
    .get(namespace + ':password')
    .smembers(namespace + ':achievements')
    .exec(function (err, replies) {
      if (err) {
        callback(err, null);
      } else {
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
      callback(err, null);
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