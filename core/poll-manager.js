var EventEmitter = require('events').EventEmitter;

var config = require('../config'),
    pollTimer = require('../app/poll-timer'),
    serviceRegistry = require('./service-registry');

var pollManager = module.exports = {
  init: function () {
    serviceRegistry.get('poll', function (pollService) {
      // check to see if today's poll already exists
      pollService.getPoll(new Date, function (err, poll) {
        // if the poll doesn't exist, create it
        if (poll.tracks.length === 0) {
          pollService.createPoll(new Date, function (err, poll) {
            if (err) {
              throw err;
            } else {
              pollTimer.start();
            }
          });
        }
        // otherwise, begin the ticker
        else {
          pollTimer.start();
        }
      });
      
      // when a new poll is to be started, create it
      pollTimer.on('pollstart', function () {
        pollService.createPoll(new Date, function (err, poll) {
          if (err) {
            throw err;
          }
        });
      });
    });
  }
};
