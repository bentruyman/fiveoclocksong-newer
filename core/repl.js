var net    = require('net'),
    repl   = require('repl');

var airport = require('airport');

var config = require('../config'),
    logger = require('../shared/log').getLogger('repl'),
    Poll   = require('../models/poll');

var air = airport(config.server.host, config.seaport.port);

var Messenger = require('../lib/messenger'),
    messenger = new Messenger,
    messengerClient = messenger.getClient();

require('colors');

var SUCCESS = 'SUCCESS\n'.green,
    FAILURE = 'FAILURE\n'.red;

air.connect('load balancer', function (loadBalancer) {
  var commands = {
    start: {
      help: 'Starts the load balancer',
      action: function () {
        loadBalancer.start();
        this.displayPrompt();
      }
    },
    stop: {
      help: 'Stop the load balancer',
      action: function () {
        loadBalancer.stop();
        this.displayPrompt();
      }
    },
    reload: {
      help: 'Reloads the load balancer',
      action: function () {
        loadBalancer.reload();
        this.displayPrompt();
      }
    },
    tracks: {
      help: 'Shows a list of tracks for the current poll',
      action: function () {
        var self = this;
        
        Poll.findTodays(function (err, poll) {
          poll.getTracks(function (err, tracks) {
            if (err) {
              self.outputStream.write(FAILURE);
            } else {
              tracks.forEach(function (track, index) {
                self.outputStream.write('[' + index + '] ' + track.key.bold + ' - ' + track.name.underline + ' by ' + track.artist.underline + '\n');
              });
            }
            self.displayPrompt();
          });
        });
      },
    },
    voteinc: {
      help: 'Increments votes on a track (username trackIndex amount)',
      action: function (input) {
        var self = this,
            args = input.split(' ');
        
        Poll.findTodays(function (err, poll) {
          poll.incrementVote(args[0], parseInt(args[1], 10), parseInt(args[2], 10), function (err) {
            if (err) {
              self.outputStream.write(FAILURE);
            } else {
              self.outputStream.write(SUCCESS);
            }
            self.displayPrompt();
          });
        });
      }
    },
    votedec: {
      help: 'Decrements votes on a track (username trackIndex amount)',
      action: function (input) {
        var self = this,
            args = input.split(' ');
        
        Poll.findTodays(function (err, poll) {
          poll.decrementVote(args[0], parseInt(args[1], 10), parseInt(args[2], 10), function (err) {
            if (err) {
              self.outputStream.write(FAILURE);
            } else {
              self.outputStream.write(SUCCESS);
            }
            self.displayPrompt();
          });
        });
      }
    },
    votes: {
      help: 'Shows the number of votes for a given track (trackIndex)',
      action: function (trackIndex) {
        var self = this;
        
        Poll.findTodays(function (err, poll) {
          poll.getTrackVotes(parseInt(trackIndex, 10), function (err, votes) {
            if (votes === null) {
              self.outputStream.write('none\n');
            } else {
              Object.keys(votes).forEach(function (voter) {
                self.outputStream.write(voter.bold + ': ' + votes[voter] + '\n');
              });
            }
            
            self.displayPrompt();
          });
        });
      }
    }
  };
  
  net.createServer(function (socket) {
    logger.info('new connection');
    var server = repl.start('fiveoclocksong> ', socket);
    
    // define each of the new commands
    Object.keys(commands).forEach(function (key) {
      server.defineCommand(key, {
        help:   commands[key].help,
        action: commands[key].action
      });
    });
  }).listen(config.repl.port);
  
  logger.info('initialized on port: ' + config.repl.port);
});
