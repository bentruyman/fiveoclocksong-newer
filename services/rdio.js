var _      = require('underscore'),
    OAuth  = require('oauth').OAuth,
    Q      = require('q');

var config = require('../config'),
    logger = require('../core/log').getLogger('rdio service');

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
    var result;
    
    logger.debug('retrieving playback token');
    
    execute({
        method: 'getPlaybackToken',
        domain: config.server.host
      },
      function (err, data, resp) {
        if (err) {
          logger.debug('failed to retrieve playback token');
          callback(err, null);
        } else {
          result = JSON.parse(data).result;
          logger.debug('successfully retrieved playback token: ' + result);
          callback(null, result);
        }
      }
    );
  },
  getTracksFromPlaylist: function (playlistId, callback) {
    logger.debug('retrieving tracks in playlist: ' + playlistId);
    
    execute({
        method: 'get',
        keys  : playlistId,
        extras: 'tracks'
      },
      function (err, data, response) {
        var tracks, rawTracks;
        
        if (err) {
          logger.debug('failed to retrieve playlist');
          return callback(err);
        }
        
        rawTracks = JSON.parse(data).result[playlistId].tracks;
        
        tracks = rawTracks.map(function (track) {
          return track.key;
        });
        
        logger.debug('successfully found tracks: ' + tracks.toString());
        
        callback(null, tracks);
      }
    );
  }
};
