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
          callback(err);
        } else {
          result = JSON.parse(data).result;
          logger.debug('successfully retrieved playback token: ' + result);
          callback(null, result);
        }
      }
    );
  },
  getTrackData: function (ids, callback) {
    // if an array of IDs are passed in, join them into a string consumable by
    // the Rdio API
    if (Array.isArray(ids)) {
      ids = ids.join(',');
    }
    
    logger.debug('retrieving track data: ' + ids);
    
    execute({
        method: 'get',
        keys: ids,
      }, function (err, data, response) {
        var tracks, rawTracks;
        
        if (err) {
          logger.debug('failed to retrieve track(s)');
          return callback(err);
        }
        
        rawTracks = JSON.parse(data).result;
        
        tracks = Object.keys(rawTracks).map(function (id) {
          var track = rawTracks[id];
          
          return {
            key:    track.key,
            name:   track.name,
            artist: track.artist,
            album:  track.album,
            icon:   track.icon
          };
        });
        
        logger.debug('successfully found data for tracks: ' + ids.toString());
        
        callback(null, tracks);
      }
    );
  },
  getTrackIdsFromPlaylist: function (playlistId, callback) {
    logger.debug('retrieving track IDs in playlist: ' + playlistId);
    
    execute({
        method: 'get',
        keys  : playlistId,
        extras: 'tracks'
      },
      function (err, data, response) {
        var ids, rawTracks;
        
        if (err) {
          logger.debug('failed to retrieve playlist');
          return callback(err);
        }
        
        rawTracks = JSON.parse(data).result[playlistId].tracks;
        
        ids = rawTracks.map(function (track) {
          return track.key;
        });
        
        logger.debug('successfully found tracks: ' + ids.toString());
        
        callback(null, ids);
      }
    );
  }
};
