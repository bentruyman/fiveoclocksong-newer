var EventEmitter = require('events').EventEmitter;

var config = require('../config'),
    PollTimer = require('../lib/poll-timer'),
    pollService = require('../services/poll');

var PollManager = module.exports = function () {
  this._pollTimer = new PollTimer;
  
  this.init = function () {
    var today = new Date;
    
    // check to see if today's poll already exists
    pollService.getPoll(today, function (err, poll) {
      // if the poll doesn't exist, create it
      if (poll.tracks.length === 0) {
        pollService.createPoll(new Date, function (err, poll) {
          if (err) {
            throw err;
          } else {
            this._pollTimer.start();
          }
        });
      }
      // otherwise, begin the ticker
      else {
        this._pollTimer.start();
      }
    });
    
    // when a new poll is to be started, create it
    this._pollTimer.on('pollstart', function () {
      pollService.createPoll(today, function (err, poll) {
        if (err) {
          throw err;
        }
      });
    });
  };
};
