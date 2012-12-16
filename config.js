var Settings = require('settings');

module.exports = new Settings({
  common: {
    app: {
      tracksPerPoll: 5
    },
    ldap: {
      // url: 'ldap://10.98.4.38:389' // inside
      url: 'ldap://bison.cmass.criticalmass.com:3268' // vpn
    },
    mongodb: {
      host: '127.0.0.1',
      port: '27017',
      db: 'fiveoclocksong'
    },
    rdio: {
      key: 'rbz4ghf2kekn8h6pyeftgure',
      secret: 'DbCSQXgrc5',
      playlistId: 'p111617'
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      prefix: 'fiveoclocksong'
    },
    repl: {
      port: 5000
    },
    security: {
      salt: 'mOYjKEw8LXPx5GLI8/wdNpWAW++ZDTxXaNJ5Q8cK'
    },
    server: {
      host: 'localhost'
    },
    timer: {
      days: [1,2,3,4,5],
      hour: 17,
      minute: 0,
      tick: 1000
    }
  },
  development: {},
  test: {},
  production: {
    repl: {
      port: 5001
    }
  }
});
