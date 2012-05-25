var _      = require('underscore'),
    OAuth  = require('oauth').OAuth,
    Q      = require('q');

var config = require('../config');

var oa = new OAuth(
  'http://api.rdio.com/oauth/request_token',
  'http://api.rdio.com/oauth/access_token',
  config.rdio.key, config.rdio.secret, '1.0',
  null, 'HMAC-SHA1'
);

function execute(params, callback) {
  oa.post(
    'http://api.rdio.com/1/',
    null, null,
    params,
    function (err, data, res) {
      callback(err, data, res);
    }
  );
}

var Rdio = module.exports = {
  getPlaybackToken: function (callback) {
    execute({
        method: 'getPlaybackToken',
        domain: config.server.host
      },
      function (err, data, resp) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, JSON.parse(data).result);
        }
      }
    );
  },
  getTracksFromPlaylist: function (playlistId, callback) {
    execute({
        method: 'get',
        keys  : playlistId,
        extras: 'tracks'
      },
      function (err, data, response) {
        var tracks, rawTracks;
        
        if (err) {
          return callback(err);
        }
        
        rawTracks = JSON.parse(data).result[playlistId].tracks;
        
        tracks = rawTracks.map(function (track) {
          return track.key;
        });
        
        callback(null, tracks);
      }
    );
  }
};
