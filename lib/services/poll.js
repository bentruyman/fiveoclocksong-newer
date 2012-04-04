var config = require('../../config'),
    rdio = require('./rdio'),
    Poll = require('../domain/poll');

var nano = require('nano')(config.database.url),
    db = nano.use(config.database.name);

// creates a date array for couchdb
function createDateArray(date) {
  date = (date) ? new Date(date) : new Date;
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

var PollService = module.exports = {
  // creates and saves a new poll to the database
  createPoll: function (date, callback) {
    var poll = new Poll({
      date: createDateArray(date)
    });
    
    // retrieve and pick a set of random tracks
    rdio.getTracksFromPlaylist(config.rdio.playlistId, function (err, tracks) {
      if (err) {
        return callback(err);
      }
      
      // TODO: Implement solution to exclude tracks from recent previous polls
      while(poll.tracks.length < config.app.tracksPerPoll) {
        poll.tracks.push(tracks.splice(Math.floor(Math.random() * tracks.length), 1)[0]);
      }
      
      db.insert(poll, function (err, resp) {
        if (err) {
          callback(err);
        } else {
          callback(null, poll);
        }
      });
    });
  },
  // retrieves a poll based on the specified date array
  getPoll: function (date, callback) {
    db.view('polls', 'byDate', { key: createDateArray(date) }, function (err, resp) {
      if (err) {
        callback(err);
      } else {
        if (resp.rows.length !== 1) {
          callback(null, null);
        } else {
          callback(null, new Poll(resp.rows[0].value));
        }
      }
    });
  },
  // registers a single vote for a track on a poll
  vote: function (user, poll, trackIndex) {
    
  }
};
