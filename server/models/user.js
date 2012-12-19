var mongoose = require('mongoose'),
    Q = require('q'),
    check = require('validator').check;

var config = require('../../config'),
    logger = require('../lib/logger').createLogger('poll model'),
    mongoClient = require('../lib/mongodb').createClient(
      config.mongodb.host,
      config.mongodb.port,
      config.mongodb.db
    );

var redisPrefix = config.redis.prefix;

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: { unique: true } },
  achievements: [{
    name: { type: String, required: true },
    data: String,
    achieved: { type: Boolean, default: false}
  }]
});

userSchema.methods.getAchievementByName = function (name) {
  var achievements = this.achievements;
  
  for (var i = 0; i < achievements.length; i++) {
    if (achievements[i].name === name) {
      return achievements[i];
    }
  }
  
  return null;
};

userSchema.methods.getAchievementData = function (name) {
  var achievement = this.getAchievementByName(name);
  
  if (achievement && achievement.data) {
    return JSON.parse(achievement.data) || {};
  }
  
  return null;
};

userSchema.methods.setAchievementData = function (name, data) {
  var achievement = this.getAchievementByName(name),
      formattedData = JSON.stringify(data);
  
  if (achievement) {
    achievement.data = formattedData;
  } else {
    this.achievements.push({
      name: name,
      data: formattedData
    });
  }
};

userSchema.methods.getAchievementState = function (name, state) {
  var achievement = this.getAchievementByName(name);
  
  if (achievement) {
    return achievement.achieved;
  }
  
  return null;
};

userSchema.methods.setAchievementState = function (name, state) {
  var achievement = this.getAchievementByName(name);
  
  if (achievement) {
    achievement.achieved = state;
  } else {
    this.achievements.push({
      name: name,
      achieved: state
    });
  }
};

userSchema.methods.achieve = function (name) {
  this.setAchievementState(name, true);
};

userSchema.methods.unachieve = function (name) {
  this.setAchievementState(name, false);
};

userSchema.statics.verifyCredentials = function (name, password, callback) {
  if (password.length === 0) {
    callback('No password specified');
  } else {
    ldapClient.bind(name + '@cmass.criticalmass.com', password, function (err, resp) {
      callback(err);
    });
  }
};

module.exports = mongoClient.model('User', userSchema);
