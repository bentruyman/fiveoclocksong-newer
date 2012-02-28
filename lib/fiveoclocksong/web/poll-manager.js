var EventEmitter = require('events').EventEmitter;

var config = require('../../../config'),
    PollService = require('../services/poll'),
    PollTimer = require('./poll-timer');

var PollManager = module.exports = {
  init: function () {
    // check to see if today's poll already exists
    PollService.getPoll(new Date, function (err, poll) {
      // if the poll doesn't exist, create it
      if (!poll) {
        PollService.createPoll(new Date, function (err, poll) {
          if (err) {
            throw err;
          } else {
            PollTimer.start();
          }
        });
      }
      // otherwise, begin the ticker
      else {
        PollTimer.start();
      }
    });
    
    // when a new poll is to be started, create it
    PollTimer.on('pollstart', function () {
      PollService.createPoll(new Date, function (err, poll) {
        if (err) {
          throw err;
        }
      });
    });
  }
};
