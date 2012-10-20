var _      = require('underscore'),
    OAuth  = require('oauth').OAuth,
    Q      = require('q');

var config = require('../../config'),
    logger = require('../lib/logger').createLogger('rdio service');

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

// a cache of track data
var trackCache = {};

// formats an Rdio track into a fiveoclocksong track
function formatTrack(track) {
  return {
    key:    track.key,
    name:   track.name,
    artist: track.artist,
    album:  track.album,
    icon:   track.icon
  };
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
    var cachedIds = Object.keys(trackCache),
        originalIds, keys;
    
    // convert ids to an array if it isn't one already
    ids = Array.isArray(ids) ? ids : [ids];
    
    // store the original list of ids
    originalIds = ids.slice(0);
    
    // filter out tracks that are in the cache
    ids = ids.filter(function (id) {
      return cachedIds.indexOf(id) === -1;
    });
    
    // if all of the tracks being requested have been cached, respond
    // immediately
    if (ids.length === 0) {
      logger.debug('retrieved all tracks from cache');
      return callback(null, originalIds.map(function (id) {
        return trackCache[id];
      }));
    }
    
    logger.debug('retrieving track data: ' + ids);
    
    execute({
        method: 'get',
        keys: ids.join(','),
      }, function (err, data, response) {
        var tracks, rawTracks;
        
        if (err) {
          logger.debug('failed to retrieve track(s)');
          return callback(err);
        }
        
        rawTracks = JSON.parse(data).result;
        
        tracks = Object.keys(rawTracks).map(function (id) {
          var track = rawTracks[id],
              formattedTrack;
          
          formattedTrack = formatTrack(track);
          
          // add the formatted track to the cache
          trackCache[id] = formattedTrack;
          
          return formattedTrack;
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
