window.ss = require('socketstream');

ss.server.on('disconnect', function () {
  console.log('Connection down :-(');
});

ss.server.on('reconnect', function () {
  console.log('Connection back up :-)');
});

ss.server.on('ready', function () {
  require('/app');
});
