var Q = require('q');

var config = require('../config'),
    db = require('../lib/db'),
    rdio = require('./rdio'),
    Poll = require('../models/poll');

var PollService = module.exports = {
  // creates and saves a new poll to the database
  createPoll: function (date, callback) {
    var poll = Poll.create({ date: Poll.createDateString(date) });
    
    // empty list of tracks to be populated
    var pollTracks = [],
        promises = [];
    
    // retrieve and pick a set of random tracks
    rdio.getTracksFromPlaylist(config.rdio.playlistId, function (err, tracks) {
      if (err) {
        return callback(err);
      }
      
      // TODO: Implement solution to exclude tracks from recent previous polls
      while(pollTracks.length < config.app.tracksPerPoll) {
        pollTracks.push(tracks.splice(Math.floor(Math.random() * tracks.length), 1)[0]);
      }
      
      pollTracks.forEach(function (track) {
        promises.push(Q.ncall(poll.addTrack, poll, track));
      });
      
      Q.all(promises).then(
        // successfully added all tracks
        function () {
          callback(null, poll);
        },
        // failed to add all tracks
        function (err) {
          callback(err, null);
        }
      );
    });
  },
  // retrieves a poll based on the specified date array
  getPoll: function (date, callback) {
    Poll.findByDate(Poll.createDateString(date), function (err, poll) {
      if (err) {
        callback(err, null);
      } else {
        poll.getTracksAndVotes(function (err, tracks, votes) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {
              tracks: tracks,
              votes: votes
            });
          }
        });
      }
    });
  }
};
