var EventEmitter = require('events').EventEmitter;

var airport = require('airport');

var config = require('../config'),
    logger = require('../shared/log').getLogger('poll manager'),
    pollService = require('../services/poll'),
    Messenger = require('../lib/messenger'),
    PollTimer = require('../lib/poll-timer');

var air = airport(config.server.host, config.seaport.port);

var messenger = new Messenger,
    messengerClient = messenger.getClient();

var pollTimer = new PollTimer();

air(function (remote, conn) {
  var self = this;
  
  pollTimer.start();
  
  this.init = function () {
    // check to see if today's poll already exists
    pollService.getTodaysPoll(function (err, poll) {
      // if the poll doesn't exist, create it
      if (poll.tracks.length === 0) {
        pollService.createTodaysPoll(function (err, poll) {
          if (err) {
            throw err;
          }
        });
      }
    });
    
    pollTimer.on('pollstart', this._onPollStart);
    pollTimer.on('pollstop', this._onPollStop);
  };
  
  this._onPollStart = function () {
    pollService.createTodaysPoll(function (err, poll) {
      if (err) {
        throw err;
      } else {
        messengerClient.publish('/poll/start', poll);
      }
    });
  };
  
  this._onPollStop = function () {
    messengerClient.publish('/poll/stop', true);
  };
}).listen('poll manager');
